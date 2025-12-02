import { Worker } from "bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { config } from "@/config";
import { setWorkerOptions } from "@/lib/bullmq/bullmq.utils";
import { DocumentsJobType } from "./documents.queue";
import { logger } from "@/lib/logger";

const usersWorker = new Worker(
  QueueName.Auth,
  async (job) => {
    console.log(
      `Processing job ${job.id} of type ${job.name === DocumentsJobType.DocumentCreatd}!!!`,
    );
    if (job.name === DocumentsJobType.DocumentCreated) {
      // process user created hib
    }
  },
  setWorkerOptions(),
);

usersWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed`);
});

usersWorker.on("failed", (job, error) => {
  logger.error({ error }, `Job ${job?.id} failed with error:`);
});

usersWorker.on("error", (error) => {
  logger.error({ error }, "Worker error:");
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down worker...");
  await usersWorker.close();
  process.exit(0);
});

logger.info("Auth Worker started and listening for jobs...");
