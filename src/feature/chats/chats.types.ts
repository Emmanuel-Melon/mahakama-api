import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatsSchema } from "./chats.schema";
import { chatMessages } from "@/feature/messages/messages.schema";
import { ChatsJobs } from "./chats.config";

export const chatSelectSchema = createSelectSchema(chatsSchema);
export const chatInsertSchema = createInsertSchema(chatsSchema);

export type ChatSession = z.infer<typeof chatSelectSchema>;
export type NewChatSession = z.infer<typeof chatInsertSchema>;
export type ChatSessionWithMessages = ChatSession & {
  messages: (typeof chatMessages.$inferSelect)[];
};

export type ChatSessionAttrs = z.infer<typeof chatsSchema>;
export type ChatSessionResponse = z.infer<typeof chatSelectSchema>;

export interface ChatsJobTypes {
  [ChatsJobs.MessageSent.jobName]: {
    userId: string;
    deviceId: string;
    message: string;
  };
}

export interface CreateChatParams {
  userId: string;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ListChatsParams {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface ChatListEntry extends Omit<ChatSession, "userId"> {
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  messageCount: number;
}

export interface UpdateChatParams {
  id: string;
  userId: string;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
}
