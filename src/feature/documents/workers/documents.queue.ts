import { queueManager, QueueManager } from "@/lib/bullmq";
import { Queue, JobsOptions } from "bullmq";
import { Document } from "../documents.schema";
import { QueueInstance } from "@/lib/bullmq/types";
import { setQueueJobOptions } from "@/lib/bullmq/utils";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export enum DocumentsJobType {
  DocumentCreated = "document-created",
  DocumentBookmarked = "document-bookmarked",
  DocumentRemoved = "document-removed",
  DocumentChunked = "document-chunked",
  DocumentDownloaded = "document-downloaded",
}

export class DocumentsQueueManager {
  private static instance: DocumentsQueueManager;
  private queueInstance: QueueInstance;
  private queue: Queue;

  private constructor() {
    this.queueInstance = queueManager.getQueue(QueueName.Documents);
    this.queue = this.queueInstance.queue;
  }

  public static getInstance(): DocumentsQueueManager {
    if (!DocumentsQueueManager.instance) {
      DocumentsQueueManager.instance = new DocumentsQueueManager();
    }
    return DocumentsQueueManager.instance;
  }

  public async enqueue<T extends Document>(
    jobName: DocumentsJobType | string,
    data: T,
    options?: JobsOptions,
  ): Promise<string> {
    const job = await this.queue.add(jobName, data, setQueueJobOptions());
    return job.id!;
  }
}

export const documentsQueue = DocumentsQueueManager.getInstance();
