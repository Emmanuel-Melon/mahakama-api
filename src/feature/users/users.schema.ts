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
import { relations } from 'drizzle-orm';
import { chatsSchema } from "@/feature/chats/chats.schema";
import { UserRoles, UserRoleValues, Gender, GenderValues } from "./users.types";

export const usersSchema = pgTable("users", {
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

// Schema for user responses (exclude sensitive fields like password)
const baseSchema = createSelectSchema(usersSchema);

export const userResponseSchema = baseSchema.omit({
  password: true,
});

// relations
export const usersRelations = relations(usersSchema, ({ many }) => ({
	chatsSchema: many(chatsSchema),
}));


export type User = z.infer<typeof usersSchema>;
export type NewUser = typeof usersSchema.$inferInsert;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UserAttrs = z.infer<typeof createUserSchema>;

export const combinedUsersSchema = {
  usersSchema,
  usersRelations
}