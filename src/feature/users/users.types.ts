import { z } from "zod";
import { usersSchema } from "./users.schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatsSchema } from "@/feature/chats/chats.schema";
import { UserJobs, UserNotificationTemplates } from "./users.config";
import { baseQuerySchema } from "@/lib/express/express.types";
import { type NotificationTemplateData } from "@/feature/notifications/notifications.types";

export const userInsertSchema = createInsertSchema(usersSchema).openapi({
  title: "NewUser",
  description: "Request schema for creating a new user",
});
export const userSelectSchema = createSelectSchema(usersSchema).openapi({
  title: "User",
  description:
    "User response schema (excluding sensitive fields like password)",
});

// Use inferred types from schemas
export type User = z.infer<typeof userSelectSchema>;
export type NewUser = z.infer<typeof userInsertSchema>;

// Type for user with relations included
export type UserWithChats = User & {
  chats: (typeof chatsSchema.$inferSelect)[];
};

export const userQuerySchema = baseQuerySchema.extend({
  role: z.string().optional(),
});

export type UserFilters = z.infer<typeof userQuerySchema>;

export type GetUsersParams = {
  id?: string;
};

export interface UserJobTypes {
  [UserJobs.UserCreated.jobName]: {
    userId: string;
  };
  [UserJobs.UserUpdated.jobName]: {
    userId: string;
  };
  [UserJobs.UserDeleted.jobName]: {
    userId: string;
  };
  [UserJobs.UserOnboarded.jobName]: {
    userId: string;
  };
  [UserJobs.UserVerified.jobName]: {
    userId: string;
    verifiedAt: string;
  };
}

export type UserCreatedNotificationData = NotificationTemplateData<
  typeof UserNotificationTemplates.USER_CREATED
>;
