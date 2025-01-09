import { nanoid } from "nanoid";

export const UserModel = (email, hashedPassword) => ({
  id: nanoid(),
  email,
  password: hashedPassword,
  createdAt: new Date().toISOString(),
});
