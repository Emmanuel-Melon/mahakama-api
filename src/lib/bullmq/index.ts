import { Queue, QueueOptions, JobState } from "bullmq";
import { config } from "../../config";
import {
  QueueInstance,
  QueueConfig,
  JobOptions,
  DEFAULT_JOB_OPTIONS,
  QueueHealth,
  QueueStatus,
} from "./types";
import { stripUpstashUrl } from "./utils";

if (!config.upstashRedisRestUrl) {
  throw new Error("Redis URL is not configured");
}

const { host, port } = stripUpstashUrl(config.upstashRedisRestUrl!);

export enum QueueName {
  Auth = "auth",
  Questions = "Questions",
  Embeddings = "embeddings",
  Answers = "Answers",
  Chat = "Chat",
}

export class QueueManager {
  private static instance: QueueManager;
  private queues: Map<QueueName, QueueInstance> = new Map();
  private defaultConfig: QueueConfig;

  private constructor() {
    this.defaultConfig = {
      connection: {
        host,
        port,
        password: config.upstashRedisRestToken || "",
        tls: {},
      },
    };
  }

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  public getQueue(
    name: QueueName,
    customConfig?: Partial<QueueConfig>,
  ): QueueInstance {
    try {
      if (this.queues.has(name)) {
        const queueInstance = this.queues.get(name);
        if (!queueInstance) {
          throw new Error(`Queue ${name} was not properly initialized`);
        }
        return queueInstance;
      }

      const config = {
        ...this.defaultConfig,
        ...customConfig,
        connection: {
          ...this.defaultConfig.connection,
          ...customConfig?.connection,
        },
      };

      const queue = new Queue(name, config as QueueOptions);

      // Add error handler for the queue
      queue.on("error", (error) => {
        console.error(`Queue ${name} error:`, error);
      });

      const instance: QueueInstance = {
        queue,
        enqueue: async <T>(data: T, options: JobOptions = {}) => {
          try {
            // Check queue health before enqueuing
            const health = await instance.getHealth();
            if (!health.isHealthy) {
              throw new Error(
                `Queue ${name} is not healthy: ${health.error || "Unknown error"}`,
              );
            }

            // Create a new object with default values
            const jobOptions: JobOptions = {
              ...DEFAULT_JOB_OPTIONS,
              ...options,
            };

            // Handle backoff separately to ensure type safety
            if (options.backoff) {
              jobOptions.backoff = {
                ...DEFAULT_JOB_OPTIONS.backoff!,
                ...options.backoff,
              };
            }

            if (!queue) {
              throw new Error(`Queue ${name} is not properly initialized`);
            }

            const job = await queue.add(name, data, jobOptions as any);
            return job;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            console.error(`Failed to enqueue job to ${name}:`, errorMessage);
            throw new Error(`Failed to enqueue job: ${errorMessage}`);
          }
        },

        getHealth: async (): Promise<QueueHealth> => {
          try {
            const [counts, isPaused] = await Promise.all([
              queue.getJobCounts(),
              queue.isPaused(),
            ]);

            const health: QueueHealth = {
              waiting: counts.wait || 0,
              active: counts.active || 0,
              completed: counts.completed || 0,
              failed: counts.failed || 0,
              delayed: counts.delayed || 0,
              paused: counts.paused || 0,
              isHealthy: !isPaused,
              lastChecked: new Date(),
            };

            // Check for excessive failures
            if (health.failed > 100 && health.failed > health.completed * 0.1) {
              health.isHealthy = false;
              health.error = `High failure rate: ${health.failed} failed jobs`;
            }

            // Check for queue size limits
            const totalJobs = health.waiting + health.active + health.delayed;
            if (totalJobs > 1000) {
              health.isHealthy = false;
              health.error = `Queue size too large: ${totalJobs} jobs`;
            }

            return health;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            return {
              waiting: 0,
              active: 0,
              completed: 0,
              failed: 0,
              delayed: 0,
              paused: 0,
              isHealthy: false,
              lastChecked: new Date(),
              error: `Health check failed: ${errorMessage}`,
            };
          }
        },

        getStatus: async (): Promise<QueueStatus> => {
          const health = await instance.getHealth();
          const isPaused = await queue.isPaused();
          const workers = await queue.getWorkers();

          return {
            ...health,
            name,
            isPaused,
            workerCount: workers.length,
          };
        },

        isHealthy: async (): Promise<boolean> => {
          try {
            const health = await instance.getHealth();
            return health.isHealthy;
          } catch {
            return false;
          }
        },
      };

      this.queues.set(name, instance);
      return instance;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to get queue ${name}:`, errorMessage);
      throw new Error(`Queue initialization failed: ${errorMessage}`);
    }
  }

  public async getQueueHealth(name: QueueName): Promise<QueueHealth> {
    try {
      const queue = this.queues.get(name);
      if (!queue) {
        throw new Error(`Queue ${name} not found`);
      }
      return queue.getHealth();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to get health for queue ${name}:`, errorMessage);
      throw new Error(`Failed to get queue health: ${errorMessage}`);
    }
  }

  public async getQueueStatus(name: QueueName): Promise<QueueStatus> {
    try {
      const queue = this.queues.get(name);
      if (!queue) {
        throw new Error(`Queue ${name} not found`);
      }
      return queue.getStatus();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to get status for queue ${name}:`, errorMessage);
      throw new Error(`Failed to get queue status: ${errorMessage}`);
    }
  }

  public async isQueueHealthy(name: QueueName): Promise<boolean> {
    try {
      const queue = this.queues.get(name);
      if (!queue) {
        throw new Error(`Queue ${name} not found`);
      }
      return queue.isHealthy();
    } catch (error) {
      console.error(`Health check failed for queue ${name}:`, error);
      return false;
    }
  }

  public async getQueuesHealth(): Promise<Record<string, QueueHealth>> {
    const health: Record<string, QueueHealth> = {};

    for (const [name, queue] of this.queues.entries()) {
      try {
        health[name] = await queue.getHealth();
      } catch (error) {
        health[name] = {
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
          delayed: 0,
          paused: 0,
          isHealthy: false,
          lastChecked: new Date(),
          error: `Failed to get health: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
      }
    }

    return health;
  }

  public async closeAll(): Promise<void> {
    try {
      if (this.queues.size === 0) {
        console.warn("No queues to close");
        return;
      }

      const closePromises = Array.from(this.queues.values()).map(
        async ({ queue }) => {
          try {
            await queue.close();
            console.log(`Successfully closed queue: ${queue.name}`);
            return { success: true, name: queue.name };
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            console.error(`Error closing queue ${queue.name}:`, errorMessage);
            return { success: false, name: queue.name, error: errorMessage };
          }
        },
      );

      const results = await Promise.allSettled(closePromises);

      // Log summary of queue closures
      const closed = results.filter(
        (r) => r.status === "fulfilled" && r.value.success,
      ).length;
      const failed = results.length - closed;

      if (failed > 0) {
        console.warn(
          `Closed ${closed} queues, failed to close ${failed} queues`,
        );
      } else {
        console.log(`Successfully closed all ${closed} queues`);
      }

      this.queues.clear();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error during queue cleanup:", errorMessage);
      throw new Error(`Failed to close all queues: ${errorMessage}`);
    }
  }
}

export const queueManager = QueueManager.getInstance();
