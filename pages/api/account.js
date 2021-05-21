import User from "../../models/User";
import jwt from "jsonwebtoken";
import connectDB from "../../utils/connectDb";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getRequest(req, res);
      break;
    case "PUT":
      await putRequest(req, res);
      break;
    default:
      res.status(405).send(`method ${req.method} not permitted`);
  }
};

async function getRequest(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("no authorized token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    console.error(error);
    res.status(403).send("invalid token");
  }
}

async function putRequest(req, res) {
  const { _id, role } = req.body;
  await User.findOneAndUpdate({ _id }, { role });
  res.status(203).send("user account status updated");
}
