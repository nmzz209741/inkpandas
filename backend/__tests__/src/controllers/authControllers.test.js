import sinon from "sinon";
import nock from "nock";
import { dynamo } from "../../../src/lib/dynamo.js";
import { cache } from "../../../src/lib/redis.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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
    sandbox.stub(dynamo);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("This is a test", () => {
    expect(true).toBe(true);
  });
});
