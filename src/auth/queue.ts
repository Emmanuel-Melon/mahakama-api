import { queueManager, QueueName, QueueInstance } from "../lib/bullmq";
import { Queue, JobsOptions } from "bullmq";
import { AuthJobData } from "./auth.types";

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
    const job = await this.queue.add(jobName, data, {
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 200, // Keep last 200 failed jobs
      attempts: 3, // Retry failed jobs up to 3 times
      backoff: {
        type: "exponential",
        delay: 1000, // Start with 1 second delay
      },
      ...options, // Allow overriding defaults
    });

    return job.id!;
  }

  public async enqueueRegistration(data: {
    userId: string;
    email: string;
    verificationToken?: string;
  }) {
    return this.enqueue(AuthJobType.Registration, {
      ...data,
      timestamp: Date.now(),
    });
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

authQueue.enqueue(AuthJobType.Registration, {
  userId: "123",
  email: "user@example.com",
});

// Example: Enqueue browser fingerprint
authQueue.enqueue(
  AuthJobType.BrowserFingerprint,
  {
    browser: "PostmanRuntime",
    browserVersion: "7.48.0",
    os: "unknown",
    platform: "unknown",
    accept: "*/*",
    acceptLanguage: "",
    acceptEncoding: "gzip, deflate, br",
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    dnt: undefined,
    upgradeInsecureRequests: undefined,
    hash: "559b64d1473d4ac98d59b7e2add559ba8c020e335528d9a35296245164f5eb93",
    timestamp: new Date("2025-10-16T19:37:54.268Z").getTime(),
    // Use the hash as the job ID for deduplication
  },
  {
    jobId: "559b64d1473d4ac98d59b7e2add559ba8c020e335528d9a35296245164f5eb93",
    removeOnComplete: true, // Remove from queue when completed
    removeOnFail: 10, // Keep last 10 failed attempts
  },
);

// Example using a helper method
// authQueue.enqueueFingerprint(fingerprintData);
