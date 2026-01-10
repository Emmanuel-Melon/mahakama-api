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
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { chatsSchema } from "@/feature/chats/chats.schema";
import { UserRoles, UserRoleValues, GenderValues } from "./users.types";

extendZodWithOpenApi(z);

export const genderSchema = z.enum(GenderValues).openapi({
  title: "Gender",
  description: "User gender options",
  example: "male",
});

export const userRoleSchema = z.enum(UserRoleValues).openapi({
  title: "UserRole",
  description: "User role in the system",
  example: "user",
});
export type UserRole = z.infer<typeof userRoleSchema>;
export type Gender = z.infer<typeof genderSchema>;

export const usersSchema = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  role: text("role", {
    enum: UserRoleValues,
  })
    .$type<UserRole>()
    .notNull()
    .default("user"),
  fingerprint: varchar("fingerprint", { length: 255 }).unique(),
  userAgent: text("user_agent"),
  lastIp: varchar("last_ip", { length: 45 }),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  age: integer("age"),
  gender: text("gender", { enum: GenderValues }).$type<Gender>(),
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

export const createUserSchema = createInsertSchema(usersSchema).openapi({
  title: "CreateUserRequest",
  description: "Request schema for creating a new user",
});
export const selectUserSchema = createSelectSchema(usersSchema).omit({
  password: true,
}).openapi({
  title: "User",
  description: "User response schema (excluding sensitive fields like password)",
});

// relations
export const usersRelations = relations(usersSchema, ({ many }) => ({
  chats: many(chatsSchema),
}));

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = typeof usersSchema.$inferInsert;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UserAttrs = z.infer<typeof createUserSchema>;

// Type for user with relations included
export type UserWithChats = User & {
  chats: (typeof chatsSchema.$inferSelect)[];
};

export const combinedUsersSchema = {
  usersSchema,
  usersRelations,
};
