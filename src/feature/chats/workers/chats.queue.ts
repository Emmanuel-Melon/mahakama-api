import { queueManager, QueueManager } from "@/lib/bullmq";
import { Queue, JobsOptions } from "bullmq";
import { ChatSessionResponse } from "../chats.types";
import { QueueInstance } from "@/lib/bullmq/bullmq.types";
import { setQueueJobOptions } from "@/lib/bullmq/bullmq.utils";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export enum ChatsJobType {
  ChatCreatd = "chat-created",
  ChatUpdated = "chat-updated",
  ChatDeleted = "chat-deleted",
}

export class ChatsQueueManager {
  private static instance: ChatsQueueManager;
  private queueInstance: QueueInstance;
  private queue: Queue;

  private constructor() {
    this.queueInstance = queueManager.getQueue(QueueName.Chat);
    this.queue = this.queueInstance.queue;
  }

  public static getInstance(): ChatsQueueManager {
    if (!ChatsQueueManager.instance) {
      ChatsQueueManager.instance = new ChatsQueueManager();
    }
    return ChatsQueueManager.instance;
  }

  public async enqueue<T extends ChatSessionResponse>(
    jobName: ChatsJobType | string,
    data: T,
    options?: JobsOptions,
  ): Promise<string> {
    const job = await this.queue.add(jobName, data, setQueueJobOptions());
    return job.id!;
  }
}

export const chatsQueue = ChatsQueueManager.getInstance();
