import { Redis } from "@upstash/redis";
import { servicesConfig } from "@/config";
import { IRedisClient } from "./redis.types";

export class UpstashClient implements IRedisClient {
  private client: Redis;
  private static instance: UpstashClient;

  constructor() {
    this.client = new Redis({
      url: servicesConfig.upstash?.restUrl,
      token: servicesConfig.upstash?.restToken,
    });
  }

  public static getInstance(): UpstashClient {
    if (!UpstashClient.instance) {
      UpstashClient.instance = new UpstashClient();
    }
    return UpstashClient.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  async get<T = string>(key: string): Promise<T | null> {
    const value = await this.client.get<T>(key);
    return value;
  }

  async set(
    key: string,
    value: any,
    options?: { ex?: number; px?: number },
  ): Promise<void> {
    if (options?.ex) {
      await this.client.setex(key, options.ex, value);
    } else if (options?.px) {
      await this.client.psetex(key, options.px, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<number> {
    const result = await this.client.del(key);
    return result;
  }

  async exists(key: string): Promise<number> {
    const result = await this.client.exists(key);
    return result;
  }
}

export const upstash = UpstashClient.getInstance();
