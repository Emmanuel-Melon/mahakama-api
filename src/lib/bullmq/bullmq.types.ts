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

export type ConnectionOptions = {
  host: string;
  port: number;
  password: string;
  tls: object;
}

export type QueueConfig = {
  connection: ConnectionOptions;
};

export type BullWorkerOptions = QueueConfig & {
  concurrency: number;
  removeOnComplete: { count: number };
  removeOnFail: { count: number };
}

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

export interface JobMetadata {
  source: string;
  requestId?: string;
  userAgent?: string | string[] | undefined;
  ip?: string;
}

export interface BaseJobPayload<T> {
  eventId: string;
  timestamp: string;
  actor: string;
  payload: T;
  metadata: JobMetadata;
}

