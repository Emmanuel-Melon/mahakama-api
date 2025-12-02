import { queueManager, QueueName } from "../../lib/bullmq";
import { Queue, JobsOptions, Worker } from "bullmq";
import { stripUpstashUrl } from "../../lib/bullmq/utils";
import { config } from "../../config/dev.config";
import { QueueInstance } from "../../lib/bullmq/types";

const { host, port } = stripUpstashUrl(config.upstashRedisRestUrl as string);
const password = config.upstashRedisRestToken;

export class EmbeddingsQueueManager {
  private static instance: EmbeddingsQueueManager;
  private queueInstance: QueueInstance;
  private queue: Queue;

  private constructor() {
    this.queueInstance = queueManager.getQueue(QueueName.Embeddings);
    this.queue = this.queueInstance.queue;
  }

  public static getInstance(): EmbeddingsQueueManager {
    if (!EmbeddingsQueueManager.instance) {
      EmbeddingsQueueManager.instance = new EmbeddingsQueueManager();
    }
    return EmbeddingsQueueManager.instance;
  }

  public async enqueue<T extends string>(
    jobName: string,
    data: T,
    options?: JobsOptions,
  ): Promise<string> {
    const job = await this.queue.add(jobName, data, {
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 200, // Keep last 200 failed jobs
      attempts: 3, // Retry failed jobs up to 3 times
    });
    return job.id!;
  }
}

const embeddingsWorker = new Worker(
  QueueName.Embeddings,
  async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
  },
  {
    connection: {
      host,
      port,
      password,
      tls: {},
    },
    concurrency: 5, // Process 5 jobs in parallel
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
    removeOnFail: { count: 200 }, // Keep last 200 failed jobs
  },
);

embeddingsWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

embeddingsWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed with error:`, error);
});

embeddingsWorker.on("error", (error) => {
  console.error("Worker error:", error);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down worker...");
  await embeddingsWorker.close();
  process.exit(0);
});

console.log("Embeddings Worker started and listening for jobs...");
