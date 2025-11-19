import { Redis } from "@upstash/redis";
import { servicesConfig } from "@/config";

export class UpstashClient {
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
}

export const upstash = UpstashClient.getInstance();
