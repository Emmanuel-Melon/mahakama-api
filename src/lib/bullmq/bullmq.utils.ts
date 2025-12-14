import { JobsOptions, WorkerOptions } from "bullmq";
import { defaultWorkerOptions, defaultBullJobOptions } from "./bullmq.config";
import { QueueConfig } from "./bullmq.types";

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
  };
};
