import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export const messagesQueue = queueManager.getQueue<any>(QueueName.Documents);
