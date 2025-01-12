import api from "../services/api";

const getAllArticles = async (page, limit = 8) => {
  try {
    const response = await api.get("/articles", { params: { page, limit } });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch articles"
    );
  }
};

const getArticleById = async (id) => {
  try {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch article");
  }
};

const createArticle = async (data) => {
  try {
    const response = await api.post("/articles", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create article"
    );
  }
};

const updateArticle = async (id, data) => {
  try {
    const response = await api.patch(`/articles/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update article"
    );
  }
};

const deleteArticle = async (id) => {
  try {
    await api.delete(`/articles/${id}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete article"
    );
  }
};

export {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
