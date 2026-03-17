import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export const documentsQueue = queueManager.getQueue<any>(QueueName.Documents);
