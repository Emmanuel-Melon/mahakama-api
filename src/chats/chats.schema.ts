import { z } from "zod";
import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { SenderType, SenderTypeValues } from "./chats.types";
import { createSelectSchema } from "drizzle-zod";

// Schema for creating a new chat
export const createChatSessionSchema = z.object({
  message: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Schema for sending a message
export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Schema for chat ID in params
export const chatIdSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, "Chat ID is required"),
  }),
});

export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  senderType: text("sender_type", {
    enum: SenderTypeValues,
  })
    .$type<SenderType>()
    .notNull(),
  title: text("title"),
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
    enum: SenderTypeValues,
  })
    .$type<SenderType>()
    .notNull(),
  senderDisplayName: text("sender_display_name"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  questionId: text("question_id"),
  metadata: jsonb("metadata").default({}),
});

export const chatSessionResponseSchema = createSelectSchema(chatSessions);

export type ChatMessageAttrs = z.infer<typeof chatMessages>;
export type ChatSession = z.infer<typeof chatSessions>;
export type SendMessageAttrs = z.infer<typeof sendMessageSchema>;
export type ChatSessionAttrs = z.infer<typeof createChatSessionSchema>;
export type ChatSessionResponse = z.infer<typeof chatSessionResponseSchema>;
