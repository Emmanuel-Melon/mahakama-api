import { JobsOptions, Queue } from "bullmq";

export type QueueInstance = {
  queue: Queue;
  enqueue: <T>(
    data: T,
    options?: JobOptions,
  ) => Promise<import("bullmq").Job<T>>;
  getHealth: () => Promise<QueueHealth>;
  getStatus: () => Promise<QueueStatus>;
  isHealthy: () => Promise<boolean>;
};

export type QueueConfig = {
  connection: {
    host: string;
    port: number;
    password: string;
    tls: object;
  };
};

export interface QueueHealth {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
  isHealthy: boolean;
  lastChecked: Date;
  error?: string;
}

export interface QueueStatus extends QueueHealth {
  name: string;
  isPaused: boolean;
  workerCount: number;
}

export interface JobOptions extends Omit<Partial<JobsOptions>, "backoff"> {
  backoff?: {
    type: "fixed" | "exponential";
    delay: number;
  };
  attempts?: number;
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
}

export const DEFAULT_JOB_OPTIONS: JobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 2000,
  },
  removeOnComplete: true,
  removeOnFail: false,
};
