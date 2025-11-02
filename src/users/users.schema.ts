import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

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

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  role: text("role", {
    enum: UserRoleValues,
  })
    .$type<UserRoles>()
    .notNull()
    .default("user"),
  fingerprint: varchar("fingerprint", { length: 255 }).unique(),
  userAgent: text("user_agent"),
  lastIp: varchar("last_ip", { length: 45 }),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  age: integer("age"),
  gender: text("gender", { enum: GenderValues }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  occupation: varchar("occupation", { length: 100 }),
  bio: text("bio"),
  profilePicture: text("profile_picture"),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schema for creating/updating a user
export const userSchema = z.object({
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

export type CreateUserRequest = z.infer<typeof userSchema>;

// Schema for user responses
export const userResponseSchema = createSelectSchema(usersTable);

export type UserAttrs = z.infer<typeof userSchema>;
export type User = z.infer<typeof userResponseSchema>;
export type NewUser = typeof usersTable.$inferInsert;
