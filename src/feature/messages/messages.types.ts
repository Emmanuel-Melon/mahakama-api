import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { chatMessages } from "./messages.schema";

extendZodWithOpenApi(z);

// Define sender type enum
export const SenderType = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export type SenderType = (typeof SenderType)[keyof typeof SenderType];

// Schema for API responses
export const chatSelectSchema = createSelectSchema(chatMessages).openapi({
  title: "ChatMessage",
  description: "Chat message response schema",
});

export const chatInsertSchema = createInsertSchema(chatMessages)
  .omit({ id: true, timestamp: true })
  .openapi({
    title: "CreateChatMessageRequest",
    description: "Request schema for creating a new chat message",
  });

export type ChatMessage = typeof chatMessages.$inferSelect & {
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  } | null;
};
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type ChatMessageResponse = z.infer<typeof chatSelectSchema>;
