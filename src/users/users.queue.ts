import { queueManager, QueueName, QueueManager } from "../lib/bullmq";
import { Queue, JobsOptions } from "bullmq";
import { UserWithoutPassword } from "./users.types";
import { QueueInstance } from "../lib/bullmq/types";
import { setQueueJobOptions } from "../lib/bullmq/utils";

export enum UsersJobType {
  UserCreatd = "user-created",
  UserUpdated = "user-updated",
  UserDeleted = "user-deleted",
  UserOnboarded = "user-onboarded",
  UserVerified = "user-verified",
}

export class UserQueueManager {
  private static instance: UserQueueManager;
  private queueInstance: QueueInstance;
  private queue: Queue;

  private constructor() {
    this.queueInstance = queueManager.getQueue(QueueName.User);
    this.queue = this.queueInstance.queue;
  }

  public static getInstance(): UserQueueManager {
    if (!UserQueueManager.instance) {
      UserQueueManager.instance = new UserQueueManager();
    }
    return UserQueueManager.instance;
  }

  public async enqueue<T extends UserWithoutPassword>(
    jobName: UsersJobType | string,
    data: T,
    options?: JobsOptions,
  ): Promise<string> {
    const job = await this.queue.add(jobName, data, setQueueJobOptions());
    return job.id!;
  }
}

export const usersQueue = UserQueueManager.getInstance();
