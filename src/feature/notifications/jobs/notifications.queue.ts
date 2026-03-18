import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export const notificationsQueue = queueManager.getQueue<any>(
  QueueName.Notifications,
);
