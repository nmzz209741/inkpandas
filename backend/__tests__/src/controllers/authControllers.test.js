import sinon from "sinon";
import nock from "nock";
import { dynamo } from "../../../src/lib/dynamo.js";
import { cache } from "../../../src/lib/redis.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
<<<<<<< Updated upstream

=======
import Redis from "ioredis";

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  }));
});
>>>>>>> Stashed changes
describe("Auth API", () => {
  let sandbox;
  const API_URL = "http://localhost:3000";
  const mockUser = {
    id: "mockId",
    email: "test@test.com",
    password: "testPassword",
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(dynamo, "query").resolves({ Items: [] });
    sandbox.stub(dynamo, "put").resolves({});

    sandbox.stub(bcrypt, "genSalt").resolves("salt");
    sandbox.stub(bcrypt, "hash").resolves("testPassword");
    sandbox.stub(bcrypt, "compare").resolves("true");

    sandbox.stub(jwt, "sign").resolves("token");
    sandbox.stub(cache, "invalidatePattern").resolves({});

    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
  });

  afterEach(() => {
    sandbox.restore();
    nock.cleanAll();
  });

  describe("POST /api/auth/register", () => {
    it("should register new user successfully if all data is supplied", async () => {
      const scope = nock(API_URL)
        .post("/api/auth/register", {
          email: mockUser.email,
          password: mockUser.password,
        })
        .reply(201, {
          message: "User registered successfully",
          token: "token",
          user: { id: expect.any(String), email: mockUser.email },
        });
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("token", "token");
      expect(response.data.user).toHaveProperty("email", mockUser.email);
      expect(response.data.user).toHaveProperty("id");

      scope.done();
    });

    it("should return 400 if user already exists", async () => {
      dynamo.query.resolves({ Items: [mockUser] });

      const scope = nock(API_URL)
        .post("/api/auth/register", {
          email: mockUser.email,
          password: mockUser.password,
        })
        .reply(400, { message: "User already exists" });

      await expect(
        axios.post(`${API_URL}/api/auth/register`, {
          email: mockUser.email,
          password: mockUser.password,
        })
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { message: "User already exists" },
        },
      });

      sinon.assert.notCalled(bcrypt.genSalt);
      sinon.assert.notCalled(dynamo.put);

      scope.done();
    });

    it("should return 400 if email is empty", async () => {
      dynamo.query.resolves({ Items: [] });

      const scope = nock(API_URL)
        .post("/api/auth/register", {
          email: "",
          password: mockUser.password,
        })
        .reply(400, { message: "User already exists" });

      await expect(
        axios.post(`${API_URL}/api/auth/register`, {
          email: "",
          password: mockUser.password,
        })
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { message: "User already exists" },
        },
      });

      sinon.assert.notCalled(bcrypt.genSalt);
      sinon.assert.notCalled(dynamo.put);

      scope.done();
    });

    it("should return 400 if password is empty", async () => {
      dynamo.query.resolves({ Items: [] });

      const scope = nock(API_URL)
        .post("/api/auth/register", {
          email: mockUser.email,
          password: "",
        })
        .reply(400, { message: "User already exists" });

      await expect(
        axios.post(`${API_URL}/api/auth/register`, {
          email: mockUser.email,
          password: "",
        })
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { message: "User already exists" },
        },
      });

      sinon.assert.notCalled(bcrypt.genSalt);
      sinon.assert.notCalled(dynamo.put);

      scope.done();
    });
  });

  describe("POST /api/auth/signin", () => {
    it("should login successfully with valid credentials", async () => {
      dynamo.query.resolves({ Items: [mockUser] });

      const expectedResponse = {
        token: "mock-token",
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      };

      const scope = nock(API_URL)
        .post("/api/auth/login", {
          email: mockUser.email,
          password: mockUser.password,
        })
        .reply(200, expectedResponse);

      const { data, status } = await axios.post(`${API_URL}/api/auth/login`, {
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(status).toBe(200);
      expect(data).toEqual(expectedResponse);

      scope.done();
    });

    it("should return 401 for invalid credentials", async () => {
      dynamo.query.resolves({ Items: [mockUser] });
      bcrypt.compare.resolves(false);

      const scope = nock(API_URL)
        .post("/api/auth/login", {
          email: mockUser.email,
          password: "wrongpassword",
        })
        .reply(401, { message: "Invalid credentials" });

      await expect(
        axios.post(`${API_URL}/api/auth/login`, {
          email: mockUser.email,
          password: "wrongpassword",
        })
      ).rejects.toMatchObject({
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      });

      sinon.assert.notCalled(dynamo.query);
      sinon.assert.notCalled(bcrypt.compare);
      sinon.assert.notCalled(jwt.sign);

      scope.done();
    });
  });
});
