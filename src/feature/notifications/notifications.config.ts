import { JsonApiResourceConfig } from "@/lib/express/express.types";
import type {
  Notification,
  NotificationPreferences,
} from "./notifications.types";

export const SerializedNotification: JsonApiResourceConfig<Notification> = {
  type: "notification",
  attributes: (notification: Notification) => notification,
};

export const SerializedNotificationPreferences: JsonApiResourceConfig<NotificationPreferences> =
  {
    type: "notification-preferences",
    attributes: (notificationPreferences: NotificationPreferences) =>
      notificationPreferences,
  };

export const NotificationJobs = {
  TriggerNotification: {
    label: "trigger-notification",
    jobName: "trigger-notification",
  },
  SendEmailNotification: {
    label: "send-email-notification",
    jobName: "send-email-notification",
  },
  SendInAppNotification: {
    label: "send-in-app-notification",
    jobName: "send-in-app-notification",
  },
  SendPushNotification: {
    label: "send-push-notification",
    jobName: "send-push-notification",
  },
} as const;

export type NotificationJobType =
  (typeof NotificationJobs)[keyof typeof NotificationJobs]["jobName"];
