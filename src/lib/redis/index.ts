import Redis, { Cluster, RedisOptions } from "ioredis";
import { IRedisClient, LocalRedisConfig } from "./types";
import { config } from "../../config";

export class LocalRedisClient implements IRedisClient {
  private client: Redis | Cluster;

  constructor(config: LocalRedisConfig) {
    if (config.mode === "cluster") {
      if (!config.cluster) {
        throw new Error("Cluster configuration is required for cluster mode");
      }

      this.client = new Redis.Cluster(config.cluster.nodes, {
        redisOptions: {
          // Default options for all nodes
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
        },
        ...config.cluster.options,
      });

      console.log(
        "🔗 Redis Cluster initialized with",
        config.cluster.nodes.length,
        "nodes",
      );
    } else {
      const options: RedisOptions = {
        host: config.standalone?.host || "localhost",
        port: config.standalone?.port || 6379,
        password: config.standalone?.password,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      };

      this.client = new Redis(options);
      console.log(`📍 Redis Standalone: ${options.host}:${options.port}`);
    }

    this.client.on("error", (err) => console.error("Redis Error:", err));
    this.client.on("connect", () => console.log("✅ Redis connected"));
  }

  async get<T = string>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (value === null) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set(
    key: string,
    value: any,
    options?: { ex?: number; px?: number },
  ): Promise<void> {
    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);

    if (options?.ex) {
      await this.client.setex(key, options.ex, serialized);
    } else if (options?.px) {
      await this.client.psetex(key, options.px, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  // Expose the raw client if you need cluster-specific operations
  getRawClient(): Redis | Cluster {
    return this.client;
  }
}
