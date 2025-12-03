import { Job } from "bullmq";
import { User } from "@/feature/users/users.schema";
import { BaseJobPayload } from "@/lib/bullmq/bullmq.types";
import { logger } from "@/lib/logger";

export const registerUserWorker = async (job: Job<BaseJobPayload<{ user: User }>>) => {
  const { payload, metadata, eventId } = job.data;
  const { user } = payload;
  try {
    logger.info(
      {
        event: "user_registered_worker_completed",
        userId: user.id,
        eventId,
        requestId: metadata.requestId,
      },
      `Successfully processed user registration for ${user.email}`,
    );
  } catch (error) {
    logger.error(
      {
        event: "user_registered_worker_error",
        error,
        userId: user.id,
        eventId,
        requestId: metadata.requestId,
      },
      `Error processing user registration for ${user.email}`,
    );
    throw error;
  }
};
