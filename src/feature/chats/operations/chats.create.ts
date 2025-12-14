import { db } from "@/lib/drizzle";
import { chatsSchema, type ChatSession } from "../chats.schema";

export interface CreateChatParams {
  userId: string;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
}

export const createChat = async (
  params: CreateChatParams,
): Promise<ChatSession | null> => {
  const [newChat] = await db
    .insert(chatsSchema)
    .values({
      userId: params.userId,
      title: params.title || "New Chat",
      metadata: params.metadata || {},
    })
    .returning();
  return newChat;
};
