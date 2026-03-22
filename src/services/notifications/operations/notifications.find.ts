import { db } from "@/lib/drizzle";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import { and, desc, eq } from "drizzle-orm";
import { toManyResult, toSingleResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult, DbSingleResult } from "@/lib/drizzle/drizzle.types";
import { Notification, NotificationPreferences } from "../notifications.types";

export const findAll = async (
  userId: string,
): Promise<DbManyResult<Notification>> => {
  const notifications = await db.query.notificationsSchema.findMany({
    orderBy: [desc(notificationsSchema.createdAt)],
  });

  return toManyResult(notifications);
};

export const getNotificationPreferences = async (
  userId: string,
): Promise<DbSingleResult<NotificationPreferences>> => {
  const preferences = await db.query.userNotificationPreferences.findFirst({
    where: eq(userNotificationPreferences.userId, userId),
  });
  return toSingleResult(preferences);
};
