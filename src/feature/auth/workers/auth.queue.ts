import { queueManager } from "@/lib/bullmq";
import { Queue, JobsOptions } from "bullmq";
import { AuthJobData } from "../auth.types";
import { QueueInstance } from "@/lib/bullmq/bullmq.types";
import { setQueueJobOptions } from "@/lib/bullmq/bullmq.utils";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { AuthJobType } from "../auth.config";

export class AuthQueueManager {
  private static instance: AuthQueueManager;
  private queueInstance: QueueInstance;
  private queue: Queue;

  private constructor() {
    this.queueInstance = queueManager.getQueue(QueueName.Auth);
    this.queue = this.queueInstance.queue;
  }

  public static getInstance(): AuthQueueManager {
    if (!AuthQueueManager.instance) {
      AuthQueueManager.instance = new AuthQueueManager();
    }
    return AuthQueueManager.instance;
  }

  public async enqueue<T extends AuthJobData>(
    jobName: AuthJobType,
    data: T,
    options?: JobsOptions,
  ): Promise<string> {
    const job = await this.queue.add(jobName, data, setQueueJobOptions(options));

    return job.id!;
  }

  public async isEmpty(): Promise<boolean> {
    const counts = await this.queue.getJobCounts(
      "waiting",
      "active",
      "delayed",
    );
    return counts.waiting === 0 && counts.active === 0 && counts.delayed === 0;
  }

  public async getJobCounts() {
    return await this.queue.getJobCounts(
      "waiting",
      "active",
      "delayed",
      "completed",
      "failed",
    );
  }

  public async close(): Promise<void> {
    await this.queue.close();
  }
}

export const authQueue = AuthQueueManager.getInstance();
