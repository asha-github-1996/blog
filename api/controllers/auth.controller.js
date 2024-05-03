import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    // Check if the user exists
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    // Check if the password is valid
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Create a token
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove the password from the user object
    const { password: pass, ...rest } = validUser._doc;

    // send the token as a cookie
    //access_token - cookie name
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnlt: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
