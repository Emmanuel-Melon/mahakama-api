import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { NotificationJobMap } from "../notifications.types";

export const notificationsQueue = queueManager.getQueue<
  NotificationJobMap[keyof NotificationJobMap]
>(QueueName.Notifications);
