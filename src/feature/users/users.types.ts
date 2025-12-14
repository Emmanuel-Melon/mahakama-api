import { z } from "zod";
import {
  User,
  NewUser,
  CreateUserRequest,
  UserAttrs,
  genderSchema,
  userRoleSchema,
} from "./users.schema";
import { GetRequestQuery } from "@/lib/express/express.types";
import {
  JsonApiResponse,
  JsonApiErrorResponse,
} from "@/lib/express/express.types";

// Use inferred types from schemas
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
