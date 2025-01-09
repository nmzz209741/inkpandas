import jwt from "jsonwebtoken";
import createError from "http-errors";

import { dynamo } from "../lib/dynamo.js";
import { USERS_TABLE } from "../constants/index.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw createError(401, "Not authorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await dynamo.get(USERS_TABLE, decoded.id);
    if (!result) {
      throw createError(401, "User not found");
    }

    const { password, ...rest } = result;
    req.user = rest;
    next();
  } catch (error) {
    next(createError(401, "Not authorized"));
  }
};
