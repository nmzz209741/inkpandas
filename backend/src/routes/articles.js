import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articlesController.js";
import { validate } from "../middlewares/validate.js";
import {
  articleCreationSchema,
  updateArticleSchema,
} from "../validators/validationSchema.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", protect, validate(articleCreationSchema), createArticle);
router.patch("/:id", protect, validate(updateArticleSchema), updateArticle);
router.delete("/:id", protect, deleteArticle);

export default router;
