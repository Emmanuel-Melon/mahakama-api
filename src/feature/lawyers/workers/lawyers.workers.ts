import { Worker } from "bullmq";
import { QueueName } from "../../lib/bullmq";
import { setWorkerOptions } from "../../lib/bullmq/utils";
import { LawyersJobType } from "./lawyers.queue";
import { logger } from "../../lib/logger";

const lawyersWorker = new Worker(
  QueueName.Auth,
  async (job) => {
    if (job.name === LawyersJobType.LawyerOnboarded) {
      // process lawyer onboarded job
    }
  },
  setWorkerOptions(),
);

lawyersWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed`);
});

lawyersWorker.on("failed", (job, error) => {
  logger.error({ error }, `Job ${job?.id} failed with error:`);
});

lawyersWorker.on("error", (error) => {
  logger.error({ error }, "Worker error:");
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down worker...");
  await lawyersWorker.close();
  process.exit(0);
});
