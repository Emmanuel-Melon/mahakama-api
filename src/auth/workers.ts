import { Worker } from "bullmq";
import { QueueName } from "../lib/bullmq";
import { config } from "../config";
import { stripUpstashUrl } from "../lib/bullmq/utils";

const { host, port } = stripUpstashUrl(config.upstashRedisRestUrl as string);
const password = config.upstashRedisRestToken;

const worker = new Worker(
  QueueName.Auth,
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

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed with error:`, error);
});

worker.on("error", (error) => {
  console.error("Worker error:", error);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down worker...");
  await worker.close();
  process.exit(0);
});

console.log("Worker started and listening for jobs...");
