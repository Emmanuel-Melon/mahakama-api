import { z } from "zod";
import { usersSchema } from "./users.schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatsSchema } from "@/feature/chats/chats.schema";
import { UserJobs, UserNotificationTemplates } from "./users.config";
import { baseQuerySchema } from "@/lib/express/express.types";
import { type NotificationTemplateData } from "@/feature/notifications/notifications.types";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const userInsertSchema = createInsertSchema(usersSchema).openapi({
  title: "NewUser",
  description: "Request schema for creating a new user",
});

export const userSelectSchema = createSelectSchema(usersSchema).openapi({
  title: "User",
  description:
    "User response schema (excluding sensitive fields like password)",
});

export const userQuerySchema = baseQuerySchema.extend({
  role: z.string().optional(),
});

// ============================================================================
// DOMAIN TYPES
// ============================================================================

// Use inferred types from schemas
export type User = z.infer<typeof userSelectSchema>;
export type NewUser = z.infer<typeof userInsertSchema>;

// Type for user with relations included
export type UserWithChats = User & {
  chats: (typeof chatsSchema.$inferSelect)[];
};

export type UserFilters = z.infer<typeof userQuerySchema>;

// ============================================================================
// API PARAMETER TYPES
// ============================================================================

export type GetUsersParams = {
  id?: string;
};

// ============================================================================
// JOB TYPES
// ============================================================================

export interface UserJobMap {
  [UserJobs.UserCreated]: {
    userId: string;
  };
  [UserJobs.UserUpdated]: {
    userId: string;
  };
  [UserJobs.UserDeleted]: {
    userId: string;
  };
  [UserJobs.UserOnboarded]: {
    userId: string;
  };
  [UserJobs.UserVerified]: {
    userId: string;
    verifiedAt: string;
  };
}

// ============================================================================
// NOTIFICATION TEMPLATE TYPES
// ============================================================================

export type UserCreatedNotificationData = NotificationTemplateData<
  typeof UserNotificationTemplates.USER_CREATED
>;
