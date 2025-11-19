import { JobsOptions, WorkerOptions } from "bullmq";
import { defaultWorkerOptions, defaultBullJobOptions } from "./bullmq.config";
import { QueueConfig } from "./bullmq.types";

export const stripUpstashUrl = (
  url: string,
): { host: string; port: number } => {
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname;
  const port = parseInt(parsedUrl.port) || 6379;
  return { host, port };
};

export const setQueueJobOptions = (options?: JobsOptions) => {
  return {
    ...defaultBullJobOptions,
    ...options, // Allow overriding defaults
  };
};

export const setWorkerOptions = (options?: WorkerOptions) => {
  return {
    ...defaultWorkerOptions,
    ...options,
  };
};

export const setQueueOptions = (options?: QueueConfig) => {
  return {
    connection: {
      host: "",
      port: 6379,
      password: "",
      tls: {},
    },
  }
}