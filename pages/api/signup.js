import connectDB from "../../utils/connectDb";
import User from "../../models/User";
import Cart from "../../models/Cart";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

connectDB();

export default async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //   validate name email and password values
    if (!isLength(name, { min: 2, max: 12 })) {
      return res.status(422).send(`name gotta be 2-12 characters long`);
    } else if (!isLength(password, { min: 6 })) {
      return res
        .status(422)
        .send(`password gotta be at least 6 characters long`);
    } else if (!isEmail(email)) {
      return res.status(422).send(`email is invalid`);
    }
    // check if user already exist in DB
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`user already exist with email ${email} `);
    }
    // if not hash their password
    const hash = await bcrypt.hash(password, 10);
    // create user
    const newUser = await new User({
      name,
      email,
      password: hash,
    }).save();
    console.log({ newUser });
    // create a cart for the new user as well
    await new Cart({ user: newUser._id }).save();
    // create token for the new user

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    // send back token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("error signing up user , please try later");
  }
};
