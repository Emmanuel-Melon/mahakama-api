import { Redis } from "@upstash/redis";
import { config } from "../config";

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

  public async testConnection(): Promise<boolean> {
    try {
      await this.client.set("connection:test", "success");
      const result = await this.client.get("connection:test");
      return result === "success";
    } catch (error) {
      console.error("Failed to test Redis connection:", error);
      return false;
    }
  }
}

// Test the connection when this module is imported
(async () => {
  try {
    const upstash = UpstashClient.getInstance();
    const isConnected = await upstash.testConnection();
    console.log(
      "Upstash Redis connection:",
      isConnected ? "✅ Success" : "❌ Failed",
    );
  } catch (error) {
    console.error("Failed to initialize Upstash Redis client:", error);
  }
})();
