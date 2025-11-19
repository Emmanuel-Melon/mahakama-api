import { Worker } from "bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { setWorkerOptions } from "@/lib/bullmq/bullmq.utils";
import { AuthEvents } from "../auth.config";
import { logger } from "@/lib/logger";
import { registrationWorker } from "./registration.worker";
import { loginWorker } from "./login.worker";

const authWorker = new Worker(
  QueueName.Auth,
  async (job) => {
    switch (job.name) {
      case AuthEvents.Login.jobName:
        await loginWorker(job);
        break;
      case AuthEvents.Registration.jobName:
        await registrationWorker(job);
        break;
      default:
        throw new Error(`Invalid job: ${job.name}`);
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
