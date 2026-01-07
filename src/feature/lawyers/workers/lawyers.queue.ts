import { queueManager } from "@/lib/bullmq";
import { Queue, JobsOptions } from "bullmq";
import { QueueInstance } from "@/lib/bullmq/bullmq.types";
import { setQueueJobOptions } from "@/lib/bullmq/bullmq.utils";
import { Lawyer } from "../lawyers.types";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export enum LawyersJobType {
  LawyerOnboarded = "lawyer-onboarded",
  LawyerVerified = "lawyer-verified",
}

export class LawyersQueueManager {
  private static instance: LawyersQueueManager;
  private queueInstance: QueueInstance;
  private queue: Queue;

  private constructor() {
    this.queueInstance = queueManager.getQueue(QueueName.User);
    this.queue = this.queueInstance.queue;
  }

  public static getInstance(): LawyersQueueManager {
    if (!LawyersQueueManager.instance) {
      LawyersQueueManager.instance = new LawyersQueueManager();
    }
    return LawyersQueueManager.instance;
  }

  public async enqueue<T extends Lawyer>(
    jobName: LawyersJobType | string,
    data: T,
    options?: JobsOptions,
  ): Promise<string> {
    const job = await this.queue.add(jobName, data, setQueueJobOptions());
    return job.id!;
  }
}

export const lawyersQueue = LawyersQueueManager.getInstance();
