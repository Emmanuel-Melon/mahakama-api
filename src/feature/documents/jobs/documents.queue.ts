import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export enum DocumentsJobType {
  DocumentCreated = "document-created",
  DocumentBookmarked = "document-bookmarked",
  DocumentRemoved = "document-removed",
  DocumentChunked = "document-chunked",
  DocumentDownloaded = "document-downloaded",
}

export const documentsQueue = queueManager.getQueue<any>(QueueName.Documents);
