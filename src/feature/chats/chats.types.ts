import { z } from "zod";
import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";

export const SenderType = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export type SenderType = (typeof SenderType)[keyof typeof SenderType];

export const SenderTypeEnum = pgEnum(
  "sender_type",
  Object.values(SenderType) as [string, ...string[]],
);

// Schema for creating a new chat
export const createchatsSchemachema = z.object({
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