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

export const createUserSchema = z.object({
  id: z.string().uuid("v4").optional(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name cannot exceed 255 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters")
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password cannot exceed 255 characters")
    .optional(),
  role: z.enum(UserRoleValues).default(UserRoles.USER).optional(),
  fingerprint: z.string().optional(),
  userAgent: z.string().optional(),
  lastIp: z.string().optional(),
  isAnonymous: z.boolean().default(false).optional(),
  age: z.number().int().positive().max(120).optional(),
  gender: z.enum(GenderValues).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  phoneNumber: z.string().max(20).optional(),
  occupation: z.string().max(100).optional(),
  bio: z.string().optional(),
  profilePicture: z.string().url("Invalid profile picture URL").optional(),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UserAttrs = z.infer<typeof createUserSchema>;