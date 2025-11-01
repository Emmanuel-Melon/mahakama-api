import { Redis } from "@upstash/redis";
import { IRedisClient } from "./types";
import { config } from "../../config";

export class UpstashClient {
  private client: Redis;
  private static instance: UpstashClient;

  private constructor() {
    if (!config.upstashRedisRestUrl || !config.upstashRedisRestToken) {
      throw new Error("Upstash Redis configuration is missing");
    }

    this.client = new Redis({
      url: config.upstashRedisRestUrl,
      token: config.upstashRedisRestToken,
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
}

export const upstash = UpstashClient.getInstance();
