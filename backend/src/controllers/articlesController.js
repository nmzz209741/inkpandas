import { dynamo } from "../lib/dynamo.js";
import { ARTICLES_TABLE } from "../constants/index.js";
import { ArticleModel } from "../models/article.js";

export const getArticles = async (req, res) => {
  const { page, limit = 50 } = req.query;
  if (limit > 100) {
    throw createError(400, "Limit cannot exceed 100 items per page");
  }
  const result = await dynamo.getAll(ARTICLES_TABLE, {
    indexName: "CreatedAtIndex",
    limit: parseInt(limit),
    lastKey: page ? JSON.parse(page) : null,
  });
  return res.status(200).json({
    articles: result.items,
    nextPage: result.lastKey ? JSON.stringify(result.lastKey) : null,
  });
};

export const getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dynamo.get(ARTICLES_TABLE, id);
    if (!result) {
      throw createError(404, `Article with id ${id} not found`);
    }
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getArticleByUserId = async (req, res) => {
  const { page, limit = 50 } = req.query;
  const userId = req.user?.id;
  try {
    const result = await dynamo.query(
      ARTICLES_TABLE,
      "UserIdIndex",
      "userId",
      userId,
      parseInt(limit),
      page ? JSON.parse(page) : null
    );
    return res.status(200).json({
      articles: result.items,
      nextPage: result.lastKey ? JSON.stringify(result.lastKey) : null,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const createArticle = async (req, res) => {
  const { title, content } = req.body;

  if (!title.trim() || !content.trim()) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const userId = req.user?.id;
  const newArticle = ArticleModel(title.trim(), content.trim(), userId);

  try {
    const article = await dynamo.put(ARTICLES_TABLE, newArticle);
    return res.status(201).json(article);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateArticle = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = req.user?.id;

  if (!title && !content) {
    return res.status(400).json({
      error: "At least one field (title or content) is required for update",
    });
  }

  if ((title && !title.trim()) || (content && !content.trim())) {
    return res.status(400).json({ error: "Title and content cannot be empty" });
  }

  try {
    const article = await dynamo.get(ARTICLES_TABLE, id);
    if (!article) {
      return res.status(404).json({ error: `Article with id ${id} not found` });
    }

    if (article.userId != userId) {
      return res
        .status(403)
        .json({ error: "User not authorized to update this article" });
    }

    const updates = {
      ...(title && { title: title.trim() }),
      ...(content && { content: content.trim() }),
      updatedAt: new Date().toISOString(),
    };

    const updatedArticle = await dynamo.update(ARTICLES_TABLE, id, updates);
    return res.status(200).json({ updatedArticle });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    const article = await dynamo.get(ARTICLES_TABLE, id);

    if (!article) {
      return res.status(404).json({ error: `Article with id ${id} not found` });
    }
    if (article.userId !== userId) {
      return res
        .status(403)
        .json({ error: "User not authorized to delete this article" });
    }
    const deleted = await dynamo.delete(ARTICLES_TABLE, id);
    if (deleted)
      return res.status(204).json({ message: "Article deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
