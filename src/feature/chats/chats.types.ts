import { z } from "zod";
import { SenderType } from "./chats.schema";

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
