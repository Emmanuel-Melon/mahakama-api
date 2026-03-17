import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export const authQueue = queueManager.getQueue<any>(QueueName.Auth);
