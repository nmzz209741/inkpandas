import express, { json, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";

import errorHandler from './middlewares/errorHandler.js';
import articleRoutes from "./routes/articles.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const bootstrapServer = async () => {
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Routes
  app.use("/api/articles", articleRoutes);
  app.use("/api/auth", authRoutes);

  // Error handling
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
};

bootstrapServer();
