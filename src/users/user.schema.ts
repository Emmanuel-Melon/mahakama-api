import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name cannot exceed 255 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters"),
  role: z.enum(["user", "admin"]).optional().default("user"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
