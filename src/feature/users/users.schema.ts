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
import { relations } from "drizzle-orm";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { chatsSchema } from "@/feature/chats/chats.schema";
import { UserRoles, UserRoleValues, GenderValues } from "./users.types";

extendZodWithOpenApi(z);

// Zod schemas for enums with OpenAPI metadata
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

export const createUserSchema = z
  .object({
    id: z.string().uuid().optional().openapi({
      example: "123e4567-e89b-12d3-a456-426614174000",
      description: "Unique identifier for the user",
    }),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name cannot exceed 255 characters")
      .optional()
      .openapi({
        example: "John Doe",
        description: "User's full name",
      }),
    email: z
      .string()
      .email("Invalid email address")
      .max(255, "Email cannot exceed 255 characters")
      .optional()
      .openapi({
        example: "user@example.com",
        description: "User's email address",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password cannot exceed 255 characters")
      .optional()
      .openapi({
        example: "securePassword123",
        description: "User's password",
      }),
    role: z.enum(UserRoleValues).default(UserRoles.USER).optional().openapi({
      example: "user",
      description: "User's role in the system",
    }),
    fingerprint: z.string().optional().openapi({
      description: "Browser fingerprint for session management",
    }),
    userAgent: z.string().optional().openapi({
      description: "User agent string from the browser",
    }),
    lastIp: z.string().optional().openapi({
      description: "Last IP address used by the user",
    }),
    isAnonymous: z.boolean().default(false).optional().openapi({
      example: false,
      description: "Whether the user is anonymous",
    }),
    age: z.number().int().positive().max(120).optional().openapi({
      example: 25,
      description: "User's age",
    }),
    gender: z.enum(GenderValues).optional().openapi({
      example: "male",
      description: "User's gender",
    }),
    country: z.string().max(100).optional().openapi({
      example: "United States",
      description: "User's country",
    }),
    city: z.string().max(100).optional().openapi({
      example: "New York",
      description: "User's city",
    }),
    phoneNumber: z.string().max(20).optional().openapi({
      example: "+1234567890",
      description: "User's phone number",
    }),
    occupation: z.string().max(100).optional().openapi({
      example: "Software Engineer",
      description: "User's occupation",
    }),
    bio: z.string().optional().openapi({
      example: "Passionate developer and tech enthusiast",
      description: "User's biography",
    }),
    profilePicture: z
      .string()
      .url("Invalid profile picture URL")
      .optional()
      .openapi({
        example: "https://example.com/profile.jpg",
        description: "URL to user's profile picture",
      }),
  })
  .openapi({
    title: "CreateUserRequest",
    description: "Request schema for creating a new user",
  });

// Schema for user responses (exclude sensitive fields like password)
const baseSchema = createSelectSchema(usersSchema);

export const userResponseSchema = baseSchema
  .omit({
    password: true,
  })
  .openapi({
    title: "User",
    description:
      "User response schema (excluding sensitive fields like password)",
  });

// relations
export const usersRelations = relations(usersSchema, ({ many }) => ({
  chatsSchema: many(chatsSchema),
}));

export type User = z.infer<typeof userResponseSchema>;
export type NewUser = typeof usersSchema.$inferInsert;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UserAttrs = z.infer<typeof createUserSchema>;

export const combinedUsersSchema = {
  usersSchema,
  usersRelations,
};
