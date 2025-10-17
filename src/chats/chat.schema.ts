import { z } from "zod";
import { RateLimitConfig } from "./chat.types";

// Schema for creating a new chat
export const createChatSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    initialMessage: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

// Schema for sending a message
export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Message content is required"),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

// Schema for chat ID in params
export const chatIdSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, "Chat ID is required"),
  }),
});

// Rate limiting configuration
export const RATE_LIMIT: RateLimitConfig = {
  anonymous: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 10, // 10 requests per day for anonymous users
  },
  user: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 100, // 100 requests per day for registered users
  },
};

import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  senderType: text("sender_type", {
    enum: ["user", "assistant", "system"],
  }).notNull(),
  title: text("title").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatSessions.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  senderId: text("sender_id").notNull(),
  senderType: text("sender_type", {
    enum: ["user", "assistant", "system", "anonymous"],
  }).notNull(),
  senderDisplayName: text("sender_display_name"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  questionId: text("question_id"),
  metadata: jsonb("metadata").default({}),
});
