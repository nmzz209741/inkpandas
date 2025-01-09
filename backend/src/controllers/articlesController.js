import { dynamo } from "../lib/dynamo.js";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { ARTICLES_TABLE } from "../constants/index.js";
import { ArticleModel } from "../models/article.js";

export const getArticles = asyncHandler(async (req, res) => {
  const { page, limit = 50 } = req.query;
  if (limit > 100) {
    throw createError(400, "Limit cannot exceed 100 items per page");
  }
  const result = await dynamo.getAll(ARTICLES_TABLE, {
    indexName: "CreatedAtIndex",
    limit: parseInt(limit),
    lastKey: page ? JSON.parse(page) : null,
  });
  res.status(200).json({
    articles: result.items,
    nextPage: result.lastKey ? JSON.stringify(result.lastKey) : null,
  });
});

export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dynamo.get(ARTICLES_TABLE, id);
    if (!result) {
      throw createError(404, `Article with id ${id} not found`);
    }
    res.status(200).json({ result });
  } catch (error) {
    throw createError(500, JSON.stringify(error));
  }
});

export const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title.trim() || !content.trim()) {
    throw createError(400, "Title and content are required");
  }
  const userId = req.user?.id;

  const newArticle = ArticleModel(title.trim(), content.trim(), userId);

  try {
    const article = await dynamo.put(ARTICLES_TABLE, newArticle);
    res.status(201).json(article);
  } catch (error) {
    throw createError(500, JSON.stringify(error));
  }
});

export const updateArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = req.user?.id;

  if (!title && !content) {
    res.status(400).json({
      error: "At least one field (title or content) is required for update",
    });
  }

  if ((title && !title.trim()) || (content && !content.trim())) {
    throw createError(400, "Title and content cannot be empty");
  }

  try {
    const article = await dynamo.get(ARTICLES_TABLE, id);
    if (!article) {
      throw createError(404, `Article with id ${id} not found`);
    }

    if (article.userId != userId) {
      throw createError(403, "User not authorized to update this article");
    }

    const updates = {
      ...(title && { title: title.trim() }),
      ...(content && { content: content.trim() }),
      updatedAt: new Date().toISOString(),
    };

    const updatedArticle = await dynamo.update(ARTICLES_TABLE, id, updates);
    res.status(200).json({ updatedArticle });
  } catch (error) {
    throw createError(500, JSON.stringify(error));
  }
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = "1";
  try {
    const article = await dynamo.get(ARTICLES_TABLE, id);

    if (!article) {
      throw createError(404, `Article with id ${id} not found`);
    }
    if (article.userId !== userId) {
      throw createError(403, "User not authorized to delete this article");
    }
    const deleted = await dynamo.delete(ARTICLES_TABLE, id);
    res.status(204).json({ message: "Article deleted successfully" });
  } catch (error) {
    throw createError(500, JSON.stringify(error));
  }
});
