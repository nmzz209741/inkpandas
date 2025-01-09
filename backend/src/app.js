import express, { json, urlencoded } from "express";
import cluster from "cluster";
import os from "os";
import cors from "cors";
import dotenv from "dotenv";

import errorHandler from "./middlewares/errorHandler.js";
import articleRoutes from "./routes/articles.js";
import authRoutes from "./routes/auth.js";

if (cluster.isPrimary) {
  const numberOfCPUs = os.cpus().length;
  for (let index = 0; index < numberOfCPUs; index++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.id} terminated`);
    cluster.fork();
  });
} else {
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

    // Health
    app.get("/health", (req, res) => {
      res.status(200).json({
        status: "healthy",
        pid: process.pid,
        uptime: process.uptime(),
      });
    });

    // Error handling
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
  };
  bootstrapServer();
}
