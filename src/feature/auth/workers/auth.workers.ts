import { Job, Worker } from "bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { setWorkerOptions } from "@/lib/bullmq/bullmq.utils";
import { AuthEvents } from "../auth.config";
import { logger } from "@/lib/logger";
import { registerUserWorker } from "./registration.worker";
import { loginWorker } from "./login.worker";

const authWorker = new Worker(
  QueueName.Auth,
  async (job: Job) => {
    switch (job.name) {
      case AuthEvents.Login.jobName:
        await loginWorker(job);
        break;
      case AuthEvents.Registration.jobName:
        await registerUserWorker(job);
        break;
      default:
        throw new Error(`Invalid job: ${job.name}`);
    }
  },
  setWorkerOptions(),
);

authWorker.on("completed", (job: Job) => {
  logger.info(`Job ${job.id} completed`);
});

authWorker.on("failed", (job: Job, error) => {
  logger.error({ error }, `Job ${job?.id} failed with error:`);
});

authWorker.on("error", (error) => {
  logger.error({ error }, "Worker error:");
});

