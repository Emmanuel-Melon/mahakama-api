import { Job } from "bullmq";
import { User } from "../users.schema";
import { BaseJobPayload } from "@/lib/bullmq/bullmq.types";
import { logger } from "@/lib/logger";

export const userCreatedWorker = async (
  job: Job<BaseJobPayload<{ user: User }>>,
) => {
  const { payload, metadata, eventId } = job.data;
  const { user } = payload;
  try {
    logger.info(
      {
        event: "user_created_worker_completed",
        userId: user.id,
        eventId,
        requestId: metadata.requestId,
      },
      `Successfully processed user creation for ${user.email}`,
    );
  } catch (error) {
    logger.error(
      {
        event: "user_created_worker_error",
        error,
        userId: user.id,
        eventId,
        requestId: metadata.requestId,
      },
      `Error processing user creation for ${user.email}`,
    );

    throw error; // Re-throw to mark job as failed
  }
};
