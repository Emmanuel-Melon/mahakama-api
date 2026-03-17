import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export const lawyersQueue = queueManager.getQueue<any>(QueueName.User);
