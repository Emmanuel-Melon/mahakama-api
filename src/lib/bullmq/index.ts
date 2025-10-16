import { Queue, QueueOptions } from "bullmq";
import { config } from "../../config";
import { QueueConfig } from "./types";
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
}

export type QueueInstance = {
  queue: Queue;
  enqueue: <T>(data: T) => Promise<void>;
};

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
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
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

    const instance: QueueInstance = {
      queue,
      enqueue: async <T>(data: T) => {
        await queue.add(name, data);
      },
    };

    this.queues.set(name, instance);
    return instance;
  }

  public async closeAll(): Promise<void> {
    await Promise.all(
      Array.from(this.queues.values()).map(({ queue }) => queue.close()),
    );
    this.queues.clear();
  }
}

export const queueManager = QueueManager.getInstance();
