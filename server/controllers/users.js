// bcrypt for hashing the user passwords
import bcrypt from "bcryptjs";
// JsonWebToken is a safe way to store the user in the browser for some period of time (e.g. 1-2 hours or more/less)
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  // whenever we have a post req, the request data is stored in req.body
  const { email, password } = req.body;

  try {
    // finding the existing user
    const existingUser = await User.findOne({ email });

    // user existence check
    if (!existingUser)
      return res.status(404).json({ message: "User doesn''t exist" });

    // password correctness check
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // if the user exists and the password is correct, then getting the user's JWT to be sent to the FE
    // need to sign the token and before provide all info we want to store in the signed token
    // the 2nd argument of jwt.sign is a secret string that only the admin knows. Shall be put in .env. For now, using 'test'
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    // returning the token
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    // if the token creation failed, 500 is Undefined Server Error
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    // checking if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // checking password and confirmPassword match
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });

    // hashing the password before creating the user
    // salt (difficulty level to hash the password) is passed as the 2nd argument
    const hashedPassword = await bcrypt.hash(password, 12);

    // creating the user
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    // when the user is created, creating the user's JWT
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    // returning the user
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
