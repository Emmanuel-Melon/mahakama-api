import { Job, Worker } from "bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { setWorkerOptions } from "@/lib/bullmq/bullmq.utils";
import { UsersJobType, UserEvents } from "../users.config";
import { logger } from "@/lib/logger";
import { userCreatedWorker } from "./user-created.worker";
import { userUpdatedWorker } from "./user-updated.worker";
import { BaseJobPayload } from "@/lib/bullmq/bullmq.types";
import { User } from "../users.schema";

const usersWorker = new Worker<BaseJobPayload<any>>(
  QueueName.User,
  async (job: Job) => {
    const { name, data } = job;
    const { payload, metadata } = data;
    logger.info(
      {
        eventId: data.eventId,
        actor: data.actor,
        requestId: metadata.requestId,
      },
      `Processing job ${job.id} of type ${name}`,
    );
    try {
      switch (name) {
        case UserEvents.UserCreated.jobName:
          await userCreatedWorker(job as Job<BaseJobPayload<{ user: User }>>);
          break;
        case UserEvents.UserUpdated.jobName:
          await userUpdatedWorker(
            job as Job<BaseJobPayload<{ user: Partial<User> }>>,
          );
          break;
        default:
          throw new Error(`Invalid job: ${name}`);
      }
    } catch (error) {
      logger.error(
        {
          error,
          jobId: job.id,
          jobName: name,
          eventId: data.eventId,
          requestId: metadata.requestId,
        },
        `Error processing job ${name}`,
      );
      throw error; // Re-throw to trigger the failed handler
    }
  },
  setWorkerOptions(),
);

usersWorker.on("completed", (job: Job) => {
  logger.info(`Job ${job.id} completed`);
});

usersWorker.on("failed", (job: Job, error) => {
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
