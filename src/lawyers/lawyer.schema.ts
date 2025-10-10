import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  text,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const lawyersTable = pgTable("lawyers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  experienceYears: integer("experience_years").notNull(),
  rating: varchar("rating", { length: 10 }).notNull(),
  casesHandled: integer("cases_handled").default(0).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  languages: text("languages").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const createLawyerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name cannot exceed 255 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters"),
  specialization: z
    .string()
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization cannot exceed 100 characters"),
  experienceYears: z
    .number()
    .int("Experience must be an integer")
    .min(0, "Experience cannot be negative"),
  rating: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && isFinite(Number(val)), {
      message: "Rating must be a number",
    })
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 0 && num <= 5;
    }, "Rating must be between 0 and 5")
    .refine((val) => {
      // Ensure the number has at most 1 decimal place
      const decimalPlaces = (val.split(".")[1] || "").length;
      return decimalPlaces <= 1;
    }, "Rating can have at most 1 decimal place"),
  casesHandled: z
    .number()
    .int("Cases handled must be an integer")
    .min(0, "Cases handled cannot be negative")
    .optional(),
  isAvailable: z.boolean().default(true).optional(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
});

export type CreateLawyerInput = z.infer<typeof createLawyerSchema>;
export type Lawyer = typeof lawyersTable.$inferSelect;
export type NewLawyer = typeof lawyersTable.$inferInsert;
