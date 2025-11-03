import { Worker } from "bullmq";
import { QueueName } from "../../lib/bullmq";
import { setWorkerOptions } from "../../lib/bullmq/utils";
import { UsersJobType } from "../users.queue";
import { logger } from "../../lib/logger";
import { userCreatedWorker } from "./user-created.worker";
import { userUpdatedWorker } from "./user-updated.worker";

const usersWorker = new Worker(
  QueueName.Auth,
  async (job) => {
    switch (job.name) {
      case UsersJobType.UserCreatd:
        await userCreatedWorker(job);
        break;
      case UsersJobType.UserUpdated:
        await userUpdatedWorker(job);
        break;
      default:
        throw new Error(`Invalid job: ${job.name}`);
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
