import connectDB from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDB();

export default async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exist with provided email
    const user = await User.findOne({ email }).select("+password");
    // if not return error
    if (!user) {
      return res
        .status(404)
        .send(`no user exist with that email, please sign-up 🤠 `);
    }
    // check to see if user password matches the one in db
    const passwordMatch = await bcrypt.compare(password, user.password);

    // if so generate a token
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "90d",
      });
      // then send that token to client
      res.status(200).json(token);
    } else {
      res.status(401).send("invalid token, password do not match");
    }
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(500).send("error logging in user");
  }
};
