import { queueManager } from "@/lib/bullmq";
import { Queue, JobsOptions } from "bullmq";
import { User } from "../users.schema";
import { QueueInstance, BaseJobPayload } from "@/lib/bullmq/bullmq.types";
import { setQueueJobOptions } from "@/lib/bullmq/bullmq.utils";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { UsersJobType } from "../users.config";

export type UsersJobPayloadMap = {
  [UsersJobType.UserCreated]: BaseJobPayload<{ user: User }>;
  [UsersJobType.UserUpdated]: BaseJobPayload<{ user: Partial<User> }>;
  [UsersJobType.UserDeleted]: BaseJobPayload<{ id: string }>;
  [UsersJobType.UserOnboarded]: BaseJobPayload<{ id: string }>;
  [UsersJobType.UserVerified]: BaseJobPayload<{
    id: string;
    verifiedAt: string;
  }>;
};

export class UsersQueueManager {
  private static instance: UsersQueueManager;
  private queueInstance: QueueInstance;
  private queue: Queue;

  private constructor() {
    this.queueInstance = queueManager.getQueue(QueueName.User);
    this.queue = this.queueInstance.queue;
  }

  public static getInstance(): UsersQueueManager {
    if (!UsersQueueManager.instance) {
      UsersQueueManager.instance = new UsersQueueManager();
    }
    return UsersQueueManager.instance;
  }

  public async enqueue<T extends UsersJobType>(
    jobName: UsersJobType | string,
    data: UsersJobPayloadMap[T],
    options?: JobsOptions,
  ): Promise<string> {
    const job = await this.queue.add(jobName, data, setQueueJobOptions());
    return job.id!;
  }
}

export const usersQueue = UsersQueueManager.getInstance();
