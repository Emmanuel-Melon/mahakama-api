import { IRedisClient } from "./redis.types";
import { IORedisClient } from "./io-redis";
import { UpstashClient } from "./upstash";
import { dbConfig, serverConfig } from "@/config";

export class RedisClient {
  static getClient(): IRedisClient {
    const redisConfig = dbConfig.redis;

    // Use individual connection
    return new IORedisClient();
  }
}

export const redisClient = RedisClient.getClient();
