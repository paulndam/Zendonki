import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import connectDB from "../../utils/connectDb";

connectDB();

const { ObjectId } = mongoose.Types;

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await putRequest(req, res);
      break;
    case "DELETE":
      await deleteRequest(req, res);
      break;
    default:
      res.status(405).send(`method  ${req.method} not allowed`);
  }
};

async function handleGetRequest(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("token not authorized");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const userCart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });
    res.status(200).json(userCart.products);
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(403).send(`please log in again`);
  }
}

async function putRequest(req, res) {
  const { quantity, productId } = req.body;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("token not authorized");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // get user cart based on user id
    const userCart = await Cart.findOne({ user: userId });
    // check if pdct exist in cart already
    const productExist = userCart.products.some((doc) =>
      ObjectId(productId).equals(doc.product)
    );
    // if so , increase qty by number qst
    if (productExist) {
      await Cart.findOneAndUpdate(
        {
          _id: userCart._id,
          "products.product": productId,
        },
        { $inc: { "products.$.quantity": quantity } }
      );
    } else {
      // if not add new prdct with given qty
      const newPdct = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        { _id: userCart._id },
        { $addToSet: { products: newPdct } }
      );
    }
    res.status(200).send(`cart have been updated`);
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(403).send(`please log in again`);
  }
}

async function deleteRequest(req, res) {
  const { productId } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("token not authorized");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: "products.product",
      model: "Product",
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(403).send(`please log in again`);
  }
}
