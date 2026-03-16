import { z } from "zod";
import {
  usersSchema,
  genderSchema,
  userRoleSchema,
} from "./users.schema";
import { GetRequestQuery } from "@/lib/express/express.types";
import {
  JsonApiResponse,
  JsonApiErrorResponse,
} from "@/lib/express/express.types";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatsSchema } from "@/feature/chats/chats.schema";

export const userInsertSchema = createInsertSchema(usersSchema).openapi({
  title: "NewUser",
  description: "Request schema for creating a new user",
});
export const userSelectSchema = createSelectSchema(usersSchema)
  .omit({
    password: true,
  })
  .openapi({
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

export type UserSuccessResponse = JsonApiResponse<User>;
export type UserErrorResponse = JsonApiErrorResponse;
export type UserResponse = UserSuccessResponse | UserErrorResponse;

export type GetUsersQuery = GetRequestQuery & {
  role?: z.infer<typeof userRoleSchema>;
};

export type GetUsersParams = {
  id?: string;
};

// Keep the constants for enum values (needed for drizzle schema)
export const Genders = {
  MALE: "male",
  FEMALE: "female",
  NON_BINARY: "non_binary",
  PREFER_NOT_TO_SAY: "prefer_not_to_say",
  OTHER: "other",
} as const;

export const UserRoles = {
  USER: "user" as const,
  ADMIN: "admin" as const,
  LAWYER: "lawyer" as const,
} as const;

// Export inferred types from schemas
export const GenderValues = Object.values(Genders) as [string, ...string[]];
export const UserRoleValues = Object.values(UserRoles) as [string, ...string[]];
