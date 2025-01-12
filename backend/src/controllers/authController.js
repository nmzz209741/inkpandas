import { dynamo } from "../lib/dynamo.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { USERS_TABLE, USERS_TABLE_GSI } from "../constants/index.js";
import { UserModel } from "../models/user.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const existingUser = await dynamo.query(
      USERS_TABLE,
      USERS_TABLE_GSI,
      "email",
      email
    );
    if (existingUser.items.length > 0) {
      return res
        .status(400)
        .json({ error: "User already exists in the database" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    const newUser = UserModel(email, hashedPwd);
    const user = await dynamo.put(USERS_TABLE, newUser);

    if (user) {
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: { id: newUser.id, email: newUser.email },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to register user" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await dynamo.query(
      USERS_TABLE,
      USERS_TABLE_GSI,
      "email",
      email
    );
    if (!user.items.length) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const { password: expectedPassword, id } = user.items[0];

    const isMatch = await bcrypt.compare(password, expectedPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(201).json({
      message: "User logged in successfully",
      token,
      user: { id, email },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to login user" });
  }
};
