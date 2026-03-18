import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "./notifications.schema";
import { NotificationJobs } from "./notifications.config";
extendZodWithOpenApi(z);

export const notificationInsertSchema = createInsertSchema(
  notificationsSchema,
).openapi({
  title: "CreateUnotification",
  description: "Request schema for creating a new notification",
});

export const notificationSelectSchema = createSelectSchema(
  notificationsSchema,
).openapi({
  title: "Notification",
  description: "Response schema for notifications",
});

export const notificationPreferencesInsertSchema = createInsertSchema(
  userNotificationPreferences,
).openapi({
  title: "Notification Preferences",
  description: "Request schema for adding notification preferences",
});

export const notificationPreferencesSelectSchema = createSelectSchema(
  userNotificationPreferences,
).openapi({
  title: "Notification Preferences",
  description: "Response schema for notification preferences",
});

export type Notification = z.infer<typeof notificationSelectSchema>;
export type NewNotification = z.infer<typeof notificationInsertSchema>;
export type NotificationPreferences = z.infer<
  typeof notificationPreferencesSelectSchema
>;
export type NewNotificationPreferences = z.infer<
  typeof notificationPreferencesInsertSchema
>;

export type NotificationAction = {
  label: string;
  url: string;
  type: "primary" | "secondary" | "danger";
  method?: "GET" | "POST";
};

export type NotificationContent = {
  title: string;
  message: string;
  action?: NotificationAction;
  metadata?: Record<string, any>;
};

export type NotificationDomain = "auth" | "system";

export interface ChannelNotificationJob {
  userId: string;
  type: NotificationDomain;
  templateKey: string;
  content: NotificationContent; // Resolved title/message from Registry
  correlationId: string;
}

export interface BaseJobPayload {
  correlationId: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}

export enum NotificationChannel {
  Email = "email",
  Push = "push",
  InApp = "in_app",
}

export type NotificationContentGenerator<T = any> = (
  data: T,
) => NotificationContent;

export interface BaseNotificationJob {
  userId: string;
  type: NotificationDomain;
  templateKey: string;
  correlationId?: string;
}

export interface TriggerNotificationJob extends BaseNotificationJob {
  channel: NotificationChannel;
  createdAt?: string;
  templateData: Record<string, string>;
}

export interface ChannelNotificationJob extends BaseNotificationJob {
  content: NotificationContent;
}

export type NotificationJobPayload = ChannelNotificationJob;

export type NotificationTemplateDescriptor<T = Record<string, string>> = {
  key: string;
  _data: T;
};

// Infer the data shape from the descriptor
export type NotificationTemplateData<T extends NotificationTemplateDescriptor> =
  T["_data"];

export interface NotificationJobTypes {
  [NotificationJobs.TriggerNotification.jobName]: {
    userId: string;
    type: string;
    correlationId: string;
  };
  [NotificationJobs.SendEmailNotification.jobName]: {
    userId: string;
    notificationId: string;
  };
  [NotificationJobs.SendInAppNotification.jobName]: {
    userId: string;
    notificationId: string;
  };
  [NotificationJobs.SendPushNotification.jobName]: {
    userId: string;
    notificationId: string;
  };
}
