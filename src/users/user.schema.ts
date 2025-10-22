import {
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  role: userRoleEnum("role").notNull().default("user"),
  fingerprint: varchar("fingerprint", { length: 255 }),
  userAgent: text("user_agent"),
  lastIp: varchar("last_ip", { length: 45 }),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schema for creating/updating a user
export const createUserSchema = z.object({
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
  role: z.enum(["user", "admin"] as const).default("user"),
  fingerprint: z.string().optional(),
  userAgent: z.string().optional(),
  lastIp: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;

// Schema for user responses
export const userResponseSchema = createSelectSchema(usersTable);

// Types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userResponseSchema>;
export type NewUser = typeof usersTable.$inferInsert;
