import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { NotificationJobs } from "../notifications.config";
import { NotificationsJobHandler } from "./notifications.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { NotificationJobMap } from "../notifications.types";

const notificationsHandlers: JobHandlerMap<NotificationJobMap> = {
  [NotificationJobs.TriggerNotification]: (data) =>
    NotificationsJobHandler.handleTriggerNotification(data),
  [NotificationJobs.SendEmailNotification]: (data) =>
    NotificationsJobHandler.handleSendEmailNotification(data),
  [NotificationJobs.SendInAppNotification]: (data) =>
    NotificationsJobHandler.handleSendInAppNotification(data),
  [NotificationJobs.SendPushNotification]: (data) =>
    NotificationsJobHandler.handleSendPushNotification(data),
};

export const initNotificationsWorker = () =>
  createBullWorker<NotificationJobMap>(
    QueueName.Notifications,
    notificationsHandlers,
  );
