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



// Schema for user responses (exclude sensitive fields like password)
const baseSchema = createSelectSchema(usersSchema);

export const userResponseSchema = baseSchema.omit({
  password: true,
});

// relations
export const usersRelations = relations(usersSchema, ({ many }) => ({
	chatsSchema: many(chatsSchema),
}));


export type User = z.infer<typeof userResponseSchema>;
export type NewUser = typeof usersSchema.$inferInsert;


export const combinedUsersSchema = {
  usersSchema,
  usersRelations
}