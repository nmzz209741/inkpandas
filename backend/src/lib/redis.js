import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || "6379",
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => console.log("Redis Client Connected!"));
redisClient.on("error", (error) => console.error("Redis Client Error:", error));

export const cache = {
  async get(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key, value, ttl = 3600) {
    await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  },

  async del(key) {
    await redisClient.del(key);
  },

  async invalidatePattern(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  },
};
