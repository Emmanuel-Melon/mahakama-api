import { IRedisClient } from "./redis.types";
import { IORedisClient } from "./io-redis";
import { UpstashClient } from "./upstash";
import { dbConfig, serverConfig } from "@/config";

export class RedisClient {
  static getClient(): IRedisClient | UpstashClient {
    switch (serverConfig.env) {
      case "production":
        return new UpstashClient();
      case "development":
      default:
        return new IORedisClient({
          mode: "standalone",
          standalone: {
            host: dbConfig.redis?.url,
            port: dbConfig.redis?.port,
          },
        });
    }
  }
}

export const redisClient = RedisClient.getClient();
