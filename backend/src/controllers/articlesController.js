import { dynamo } from "../lib/dynamo.js";
import { nanoid } from "nanoid";

const articlesTable = "Articles";

export const getArticles = async (req, res) => {
  const { page, limit = 50 } = req.query;
  const result = await dynamo.getAll(articlesTable, {
    indexName: "CreatedAtIndex",
    limit: parseInt(limit),
    lastKey: page ? JSON.parse(page) : null,
  });
  res.status(200).json({
    articles: result.items,
    nextPage: result.lastKey ? JSON.stringify(result.lastKey) : null,
  });
};

export const getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dynamo.get(articlesTable, id);
    if (!result) {
      res.status(404).json({ error: `Article with id ${id} not found` });
    }
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createArticle = async (req, res) => {
  const { title, content } = req.body;

  if (!title.trim() || !content.trim()) {
    res.status(400).json({ error: "Title and content are required" });
  }

  const newArticle = {
    id: nanoid(),
    userId: "1", // TODO: Update this
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  try {
    const article = await dynamo.put(articlesTable, newArticle);
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateArticle = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = "1"; // TODO: Update this

  if (!title && !content) {
    res.status(400).json({
      error: "At least one field (title or content) is required for update",
    });
  }

  if ((title && !title.trim()) || (content && !content.trim())) {
    res.status(400).json({ error: "Title and content cannot be empty" });
  }

  try {
    const article = await dynamo.get(articlesTable, id);
    if (!article) {
      res.status(404).json({ error: `Article with id ${id} not found` });
    }

    if (article.userId != userId) {
      res
        .status(403)
        .json({ error: "User not authorized to update this article" });
    }

    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    updates.updatedAt = new Date().toISOString();
    const updatedArticle = await dynamo.update(articlesTable, id, updates);
    res.status(200).json({ updatedArticle });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const userId = "1";
  try {
    const article = await dynamo.get(articlesTable, id);

    if (!article) {
      res.status(404).json({ error: `Article with id ${id} not found` });
    }
    if (article.userId !== userId) {
      res
        .status(403)
        .json({ error: "User not authorized to delete this article" });
    }
    const deleted = await dynamo.delete(articlesTable, id);
    res.status(204).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
