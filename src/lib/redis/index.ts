import Redis, { RedisOptions } from "ioredis";
import { dbConfig } from "@/config";
import { logger } from "@/lib/logger";

const getRedisOptions = (): RedisOptions => ({
  host: dbConfig.redis?.url || "localhost",
  port: Number(dbConfig.redis?.port) || 6379,
  // CRITICAL: BullMQ requires this to be null to handle its own retries
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

let redisInstance: Redis | null = null;

export const getRedisConnection = (): Redis => {
  if (!redisInstance) {
    const options = getRedisOptions();
    redisInstance = new Redis(options);

    redisInstance.on("error", (err) =>
      logger.error({ error: err }, "Redis Error:"),
    );
    redisInstance.on("connect", () => logger.info("✅ Redis connected"));
  }
  return redisInstance;
};
