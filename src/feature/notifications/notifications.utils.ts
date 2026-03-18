import { emailQueue, inAppQueue, pushQueue } from "./jobs/notifications.queue";
import {
  ChannelNotificationJob,
  NotificationChannel,
  NotificationPreferences,
} from "./notifications.types";
import { JobOptions } from "@/lib/bullmq/bullmq.types";

export const getTargetChannels = (
  prefs: NotificationPreferences,
): NotificationChannel[] => {
  const channels: NotificationChannel[] = [];
  if (prefs.emailEnabled) channels.push(NotificationChannel.Email);
  if (prefs.inAppEnabled) channels.push(NotificationChannel.InApp);
  if (prefs.pushEnabled) channels.push(NotificationChannel.Push);
  return channels;
};

export const routeToBullChannel = async (
  channel: NotificationChannel,
  data: ChannelNotificationJob,
  options?: JobOptions,
) => {
  const jobPayload = {
    eventId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    actor: "system-dispatcher",
    payload: data,
    metadata: { source: "notification-engine" },
  };

  switch (channel) {
    case NotificationChannel.Email:
      return emailQueue.enqueue(jobPayload, options);
    case NotificationChannel.InApp:
      return inAppQueue.enqueue(jobPayload, options);
    case NotificationChannel.Push:
      return pushQueue.enqueue(jobPayload, options);
  }
};
