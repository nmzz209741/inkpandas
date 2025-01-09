import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articlesController.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", protect, createArticle);
router.patch("/:id", protect, updateArticle);
router.delete("/:id", protect, deleteArticle);

export default router;
