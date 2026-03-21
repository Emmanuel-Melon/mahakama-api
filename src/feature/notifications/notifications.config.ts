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
  TriggerNotification: "trigger-notification",
  SendEmailNotification: "send-email-notification",
  SendInAppNotification: "send-in-app-notification",
  SendPushNotification: "send-push-notification",
} as const;

export type NotificationJobType =
  (typeof NotificationJobs)[keyof typeof NotificationJobs];
