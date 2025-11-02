import { Worker } from "bullmq";
import { QueueName } from "../lib/bullmq";
import { config } from "../config";
import { setWorkerOptions } from "../lib/bullmq/utils";
import { UsersJobType } from "./users.queue";
import { logger } from "../lib/logger";

const authWorker = new Worker(
  QueueName.Auth,
  async (job) => {
    console.log(
      `Processing job ${job.id} of type ${job.name === UsersJobType.UserCreatd}!!!`,
    );
    if (job.name === UsersJobType.UserCreatd) {
      // process user created hib
    }
  },
  setWorkerOptions(),
);

authWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed`);
});

authWorker.on("failed", (job, error) => {
  logger.error({ error }, `Job ${job?.id} failed with error:`);
});

authWorker.on("error", (error) => {
  logger.error({ error }, "Worker error:");
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down worker...");
  await authWorker.close();
  process.exit(0);
});

logger.info("Auth Worker started and listening for jobs...");
