import { Worker } from "bullmq";
import { QueueName } from "../../lib/bullmq";
import { config } from "../../config";
import { setWorkerOptions } from "../../lib/bullmq/utils";
import { ChatsJobType } from "./chats.queue";
import { logger } from "../../lib/logger";

const chatsWorker = new Worker(
  QueueName.Auth,
  async (job) => {
    console.log(
      `Processing job ${job.id} of type ${job.name === ChatsJobType.ChatCreatd}!!!`,
    );
    if (job.name === ChatsJobType.ChatCreatd) {
      // process chat created job
    }
  },
  setWorkerOptions(),
);

chatsWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed`);
});

chatsWorker.on("failed", (job, error) => {
  logger.error({ error }, `Job ${job?.id} failed with error:`);
});

chatsWorker.on("error", (error) => {
  logger.error({ error }, "Worker error:");
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down worker...");
  await chatsWorker.close();
  process.exit(0);
});

logger.info("Auth Worker started and listening for jobs...");
