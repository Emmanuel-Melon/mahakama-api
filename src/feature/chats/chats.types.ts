import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatsSchema } from "./chats.schema";
import { chatMessages } from "@/feature/messages/messages.schema";

export const chatSelectSchema = createSelectSchema(chatsSchema);
export const chatInsertSchema = createInsertSchema(chatsSchema);

export type ChatSession = z.infer<typeof chatSelectSchema>;
export type NewChatSession = z.infer<typeof chatInsertSchema>;
export type ChatSessionWithMessages = ChatSession & {
  messages: (typeof chatMessages.$inferSelect)[];
};

export type ChatSessionAttrs = z.infer<typeof chatsSchema>;
export type ChatSessionResponse = z.infer<typeof chatSelectSchema>;