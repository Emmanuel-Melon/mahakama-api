import {
  NotificationContentGenerator,
  NotificationContent,
} from "./notifications.types";
import { usersNotificationRegistry } from "../users/users.notifications";
import { logger } from "@/lib/logger";

export const NotificationsTemplateRegistry: Record<
  string,
  NotificationContentGenerator
> = {
  ...usersNotificationRegistry,
};

export class NotificationsRegistry {
  static generateNotificationContent(
    templateKey: string,
    data: Record<string, string>,
  ): NotificationContent {
    const generator = NotificationsTemplateRegistry[templateKey];
    if (!generator) {
      logger.error(
        { templateKey },
        "No notification generator found for template key",
      );
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          `No notification generator registered for key: "${templateKey}"`,
        );
      }
      return { title: "Update", message: "You have a new notification." };
    }
    return generator(data);
  }
}
