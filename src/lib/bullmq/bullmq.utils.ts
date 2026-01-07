import { JobsOptions, WorkerOptions } from "bullmq";
import Redis from "ioredis";
import { defaultWorkerOptions, defaultBullJobOptions } from "./bullmq.config";
import { QueueConfig, ConnectionOptions } from "./bullmq.types";
import { config } from "@/config";

// Shared Redis connection instance
let redisConnection: Redis | null = null;

export const getRedisConnection = (): Redis => {
  if (!redisConnection) {
    const redisConfig = config.db.redis;
    
    if (redisConfig?.url && !redisConfig.url.startsWith('redis://')) {
      // If URL is not a proper redis:// URL, treat it as host
      redisConnection = new Redis({
        host: redisConfig.url,
        port: redisConfig?.port || 6379,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: null, // Required by BullMQ
      });
    } else if (redisConfig?.url) {
      redisConnection = new Redis(redisConfig.url, {
        maxRetriesPerRequest: null, // Required by BullMQ
      });
    } else {
      redisConnection = new Redis({
        host: redisConfig?.host || "localhost",
        port: redisConfig?.port || 6379,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: null, // Required by BullMQ
      });
    }
  }
  return redisConnection;
};

export const setQueueJobOptions = (options?: JobsOptions) => {
  return {
    ...defaultBullJobOptions,
    ...options, // Allow overriding defaults
  };
};

export const setWorkerOptions = (options?: WorkerOptions) => {
  const connection = getRedisConnection();
  
  return {
    ...defaultWorkerOptions,
    connection,
    ...options,
  };
};

export const setQueueOptions = (options?: QueueConfig): QueueConfig => {
  const connection = getRedisConnection();
  
  return {
    connection,
    ...options,
  };
};
