import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { NotificationJobs } from "../notifications.config";
import { NotificationsJobHandler } from "./notifications.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { NotificationJobTypes } from "../notifications.types";

const notificationsHandlers: JobHandlerMap<NotificationJobTypes> = {
  [NotificationJobs.TriggerNotification.jobName]: (data) =>
    NotificationsJobHandler.handleTriggerNotification(data),
  [NotificationJobs.SendEmailNotification.jobName]: (data) =>
    NotificationsJobHandler.handleSendEmailNotification(data),
  [NotificationJobs.SendInAppNotification.jobName]: (data) =>
    NotificationsJobHandler.handleSendInAppNotification(data),
  [NotificationJobs.SendPushNotification.jobName]: (data) =>
    NotificationsJobHandler.handleSendPushNotification(data),
};

export const initNotificationsWorker = () =>
  createBullWorker<NotificationJobTypes>(
    QueueName.Notifications,
    notificationsHandlers,
  );
