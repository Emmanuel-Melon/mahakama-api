import { queueManager, QueueName } from "../lib/bullmq";
import { Queue, JobsOptions } from "bullmq";
import { AuthJobData } from "./auth.types";
import { QueueInstance } from "../lib/bullmq/types";
import { setQueueJobOptions } from "../lib/bullmq/utils";

export enum AuthJobType {
  Registration = "registration",
  Login = "login",
  PasswordReset = "password-reset",
  EmailVerification = "email-verification",
  TwoFactorAuth = "2fa-verification",
  BrowserFingerprint = "browser-fingerprint",
}

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
    jobName: AuthJobType | string,
    data: T,
    options?: JobsOptions,
  ): Promise<string> {
    const job = await this.queue.add(jobName, data, setQueueJobOptions());

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
