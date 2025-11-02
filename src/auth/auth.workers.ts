import { Worker } from "bullmq";
import { QueueName } from "../lib/bullmq";
import { config } from "../config";
import { setWorkerOptions } from "../lib/bullmq/utils";
import { AuthJobType } from "./auth.queue";
import { v4 as uuid } from "uuid";
import { createUser } from "../users/operations/users.create";
import { findByFingerprint } from "../users/operations/users.find";
import { createRandomUser } from "../users/operations/users.create";
import { logger } from "../lib/logger";

const authWorker = new Worker(
  QueueName.Auth,
  async (job) => {
    logger.info(
      `Processing job ${job.id} of type ${job.name === AuthJobType.BrowserFingerprint}!!!`,
    );
    if (job.name === AuthJobType.BrowserFingerprint) {
      const userByFingerprint = await findByFingerprint(job.id!);
      if (userByFingerprint) {
        return;
      }
      const randomUser = await createRandomUser();
      const newUser = await createUser({
        id: uuid(),
        name: randomUser.name,
        email: randomUser.email,
        fingerprint: job.id!,
        userAgent: job.data.userAgent,
        password: randomUser.password,
      });
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
