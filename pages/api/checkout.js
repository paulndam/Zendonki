import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import Order from "../../models/Order";
import calculateCartTotal from "../../utils/calculateCartTotal";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { paymentData } = req.body;

  try {
    // verify and get user id from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // find cart based on user id, populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });
    // calculate cart totals again from cart product
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);
    // get email from payment data and see if email is linked to existing stripe customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1,
    });
    const existingCustomer = prevCustomer.data.length > 0;
    // if not existing custmr , create them base on their email
    let newCustomer;
    if (!existingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id,
      });
    }
    const customer =
      (existingCustomer && prevCustomer.data[0].id) || newCustomer.id;
    // creat charge with total and send them email reciept
    const charge = await stripe.charges.create(
      {
        currency: "usd",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `checkout | ${paymentData.email} | ${paymentData.id}`,
      },
      {
        idempotency_key: uuidv4(),
      }
    );
    // add order to db
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products,
    }).save();
    // clear product in cart
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });
    // send back success response
    res.status(200).send("checkout successful");
  } catch (error) {
    console.log(error);
    res.status(500).send(`error processing payment`);
  }
};
