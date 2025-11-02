import { JobsOptions } from "bullmq";
import { config } from "../../config";

export const stripUpstashUrl = (
  url: string,
): { host: string; port: number } => {
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname;
  const port = parseInt(parsedUrl.port) || 6379;
  return { host, port };
};

const { host, port } = stripUpstashUrl(config.upstashRedisRestUrl as string);
const upStashPassword = config.upstashRedisRestToken;

const defaultJobOptions = {
  removeOnComplete: 100, // Keep last 100 completed jobs
  removeOnFail: 200, // Keep last 200 failed jobs
  attempts: 3, // Retry failed jobs up to 3 times
  backoff: {
    type: "exponential",
    delay: 1000, // Start with 1 second delay
  },
};

export const setQueueJobOptions = (options?: JobsOptions) => {
  return {
    ...defaultJobOptions,
    ...options, // Allow overriding defaults
  };
};

const defaultWorkerOptions = {
  connection: {
    host,
    port,
    password: upStashPassword,
    tls: {},
  },
  concurrency: 5, // Process 5 jobs in parallel
  removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
  removeOnFail: { count: 200 }, // Keep last 200 failed jobs
};

export const setWorkerOptions = (options?: any) => {
  return {
    ...defaultWorkerOptions,
  };
};
