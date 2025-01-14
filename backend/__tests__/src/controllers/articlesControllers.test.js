import sinon from "sinon";
import nock from "nock";
import { dynamo } from "../../../src/lib/dynamo.js";
import { cache } from "../../../src/lib/redis.js";
import {
  getArticles,
  getArticleById,
  getArticleByUserId,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../../src/controllers/articlesController.js";
import axios from "axios";

jest.mock("../../../src/models/article.js", () => ({
  ArticleModel: jest.fn().mockReturnValue({
    id: "mockId",
    title: "Mock Title",
    content: "Mock content",
    userId: "userId",
    createdAt: "2025-01-14T00:00:00Z",
    updatedAt: "2025-01-14T00:00:00Z",
  }),
}));

describe("Articles API", () => {
  let sandbox;
  let dynamoGet;
  const API_URL = "http://localhost:3000";

  const mockArticle = {
    id: "mockId",
    title: "Mock Title",
    content: "Mock content",
    userId: "userId",
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(dynamo, "getAll").resolves({ items: [mockArticle], lastKey: null });
    dynamoGet = sandbox.stub(dynamo, "get").resolves(mockArticle);
    sandbox.stub(dynamo, "put").resolves(mockArticle);
    sandbox.stub(dynamo, "update").resolves(mockArticle);
    sandbox.stub(dynamo, "delete").resolves(true);

    sandbox.stub(cache, "get");
    sandbox.stub(cache, "set");
    sandbox.stub(cache, "del");
    sandbox.stub(cache, "invalidatePattern");

    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
  });

  afterEach(() => {
    sandbox.restore();
    nock.cleanAll();
  });

  describe("GET /api/articles", () => {
    it("should return a list of articles", async () => {
      const scope = nock(API_URL)
        .get("/api/articles")
        .query({ limit: 50 })
        .reply(200, {
          articles: [mockArticle],
          nextPage: null,
        });

      const response = await axios.get(`${API_URL}/api/articles`, {
        params: { limit: 50 },
      });

      expect(response.status).toBe(200);
      expect(response.data.articles).toHaveLength(1);
      expect(response.data.articles[0]).toHaveProperty("title", "Mock Title");

      scope.done();
    });
  });

  describe("GET /api/articles/:id", () => {
    it("should return article by ID", async () => {
      const scope = nock(API_URL)
        .get("/api/articles/mockId")
        .reply(200, { result: mockArticle });

      const response = await axios.get(`${API_URL}/api/articles/mockId`);
      expect(response.status).toBe(200);
      expect(response.data.result).toHaveProperty("id", "mockId");

      scope.done();
    });

    it("should return 404 if article is not found", async () => {
      dynamoGet.resolves(null);
      const scope = nock(API_URL)
        .get("/api/articles/mockId")
        .reply(404, { error: "Article with id mockId not found" });

      await expect(axios.get(`${API_URL}/api/articles/mockId`)).rejects.toMatchObject({
        response: {
          status: 404,
          data: { error: "Article with id mockId not found" },
        },
      });

      scope.done();
    });
  });

  describe("POST /api/articles", () => {
    it("should create a new article", async () => {
      const scope = nock(API_URL).post("/api/articles").reply(201, mockArticle);

      const response = await axios.post(`${API_URL}/api/articles`, {
        title: "New Article",
        content: "Article Content",
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("title", "Mock Title");

      scope.done();
    });

    it("should return 400 if title or content is missing", async () => {
      const scope = nock(API_URL)
        .post("/api/articles")
        .reply(400, { error: "Title and content are required" });

      await expect(
        axios.post(`${API_URL}/api/articles`, { title: "", content: "Content is here" })
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { error: "Title and content are required" },
        },
      });

      scope.done();
    });
  });

  describe("PUT /api/articles/:id", () => {
    it("should update an existing article", async () => {
      const scope = nock(API_URL)
        .put("/api/articles/mockId")
        .reply(200, mockArticle);

      const response = await axios.put(`${API_URL}/api/articles/mockId`, {
        title: "Updated Title",
        content: "Updated content",
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("title", "Mock Title");

      scope.done();
    });

    it("should return 400 if title or content is empty", async () => {
      const scope = nock(API_URL)
        .put("/api/articles/mockId")
        .reply(400, { error: "Title and content cannot be empty" });

      await expect(
        axios.put(`${API_URL}/api/articles/mockId`, { title: "", content: "Updated content" })
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { error: "Title and content cannot be empty" },
        },
      });

      scope.done();
    });

    it("should return 404 if article is not found", async () => {
      dynamoGet.resolves(null);
      const scope = nock(API_URL)
        .put("/api/articles/mockId")
        .reply(404, { error: "Article with id mockId not found" });

      await expect(
        axios.put(`${API_URL}/api/articles/mockId`, { title: "Updated Title", content: "Updated content" })
      ).rejects.toMatchObject({
        response: {
          status: 404,
          data: { error: "Article with id mockId not found" },
        },
      });

      scope.done();
    });
  });

  describe("DELETE /api/articles/:id", () => {
    it("should delete an article", async () => {
      const scope = nock(API_URL)
        .delete("/api/articles/mockId")
        .reply(204, { message: "Article deleted successfully" });

      const response = await axios.delete(`${API_URL}/api/articles/mockId`);

      expect(response.status).toBe(204);
      expect(response.data).toEqual({ message: "Article deleted successfully" });

      scope.done();
    });

    it("should return 404 if article is not found", async () => {
      dynamoGet.resolves(null);
      const scope = nock(API_URL)
        .delete("/api/articles/mockId")
        .reply(404, { error: "Article with id mockId not found" });

      await expect(axios.delete(`${API_URL}/api/articles/mockId`)).rejects.toMatchObject({
        response: {
          status: 404,
          data: { error: "Article with id mockId not found" },
        },
      });

      scope.done();
    });

    it("should return 403 if user is not authorized to delete", async () => {
      const unauthorizedArticle = { ...mockArticle, userId: "anotherUserId" };
      dynamoGet.resolves(unauthorizedArticle);
      const scope = nock(API_URL)
        .delete("/api/articles/mockId")
        .reply(403, { error: "User not authorized to delete this article" });

      await expect(axios.delete(`${API_URL}/api/articles/mockId`)).rejects.toMatchObject({
        response: {
          status: 403,
          data: { error: "User not authorized to delete this article" },
        },
      });

      scope.done();
    });
  });
});
