import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export const chatsQueue = queueManager.getQueue<any>(QueueName.Chat);
