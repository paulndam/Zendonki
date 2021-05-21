import Cart from "../../models/Cart";
import Product from "../../models/Product";
import connectDB from "../../utils/connectDb";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getRequest(req, res);
      break;
    case "POST":
      await postRequest(req, res);
      break;
    case "DELETE":
      await deleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

const getRequest = async (req, res) => {
  const { _id } = req.query;
  const product = await Product.findOne({ _id });
  res.status(200).json(product);
};

const postRequest = async (req, res) => {
  const { name, price, description, mediaUrl } = req.body;
  try {
    if (!name || !price || !description || !mediaUrl) {
      return res.status(422).send("please fill in all fields");
    }
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl,
    }).save();
    res.status(201).json({ message: "product created", product });
  } catch (error) {
    res.status(500).send("SERVER ERROR IN CREATING PRODUCT FROM SERVER SIDE");
    console.error(error);
  }
};

const deleteRequest = async (req, res) => {
  const { _id } = req.query;
  try {
    // delete the product bhy id
    await Product.findOneAndDelete({ _id });
    // remove prdct from all carts, referenced as 'product
    res.status(204).json({ message: "product deleted successfuly" });
    await Cart.updateMany(
      {
        "products.product": _id,
      },
      { $pull: { products: { product: _id } } }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("error deleting product");
  }
};
