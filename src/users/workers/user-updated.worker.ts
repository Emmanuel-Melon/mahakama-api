import { Job } from "bullmq";
import { User } from "../users.schema";
import { BaseJobPayload } from "../../lib/bullmq/types";
import { logger } from "../../lib/logger";

export const userUpdatedWorker = async (
  job: Job<BaseJobPayload<{ user: Partial<User> }>>,
) => {
  const { payload, metadata, timestamp, actor, eventId } = job.data;
  const { user } = payload;

  if (!user.id) {
    throw new Error("User ID is required for update");
  }

  try {
    logger.info(
      {
        event: "user_updated_worker_completed",
        userId: user.id,
        eventId,
        requestId: metadata.requestId,
      },
      `Successfully processed user update for ID: ${user.id}`,
    );
  } catch (error) {
    logger.error(
      {
        event: "user_updated_worker_error",
        error,
        userId: user.id,
        eventId,
        requestId: metadata.requestId,
      },
      `Error processing user update for ID: ${user.id}`,
    );

    throw error; // Re-throw to mark job as failed
  }
};
