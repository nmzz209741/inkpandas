import { nanoid } from "nanoid";

export const ArticleModel = (title, content, userId) => ({
  id: nanoid(),
  title,
  content,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
