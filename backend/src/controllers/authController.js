import { dynamo } from "../lib/dynamo";
import bcrypt from "bcryptjs";
import nanoid from "nanoid";
import { jwt } from "jsonwebtoken";

const usersTable = "Users";

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const existingUser = await dynamo.query(
      usersTable,
      "EmailIndex",
      "email",
      email
    );
    if (existingUser.length > 0) {
      res.status(400).json({ error: "User already exists in the database" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    const newUser = {
      id: nanoid(),
      email,
      password: hashedPwd,
      createdAt: new Date().toISOString(),
    };

    const user = await dynamo.put(usersTable, newUser);

    if (user) {
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};
