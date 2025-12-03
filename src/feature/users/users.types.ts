import { z } from "zod";
import { User } from "./users.schema";
import { BaseExpressResponse } from "@/lib/express/express.types";
import { GetRequestQuery } from "@/lib/express/express.types";

export type UserWithoutPassword = Omit<User, "password">;

export type UserSuccessResponse = BaseExpressResponse<UserWithoutPassword> & {
  success: true;
};
export type UserErrorResponse = BaseExpressResponse<UserWithoutPassword> & {
  success: false;
};

export type UserResponse = UserSuccessResponse | UserErrorResponse;

export type GetUsersQuery = Omit<GetRequestQuery, 'page' | 'limit'> & {
  role?: "admin" | "user" | "lawyer";
  page?: number | string;
  limit?: number | string;
};

export type GetUsersParams = {
  id?: string;
};

export const Genders = {
  MALE: "male",
  FEMALE: "female",
  NON_BINARY: "non_binary",
  PREFER_NOT_TO_SAY: "prefer_not_to_say",
  OTHER: "other",
} as const;

export type Gender = (typeof Genders)[keyof typeof Genders];
export const GenderValues = Object.values(Genders) as [string, ...string[]];

export const UserRoles = {
  USER: "user" as const,
  ADMIN: "admin" as const,
  LAWYER: "lawyer" as const,
} as const;

export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];
export const UserRoleValues = Object.values(UserRoles) as [string, ...string[]];