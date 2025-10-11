import { db } from "../../lib/drizzle";
import { chatSessions } from "../chat.schema";
import { eq, and } from "drizzle-orm";
import { ChatSession } from "../chat.types";

export const getChat = async (chatId: string, userId: string): Promise<ChatSession | null> => {
  // Get only the chat session without messages
  const [chat] = await db
    .select()
    .from(chatSessions)
    .where(
      and(
        eq(chatSessions.id, chatId),
        eq(chatSessions.userId, userId) // Ensure user owns the chat
      )
    )
    .limit(1);

  if (!chat) {
    return null;
  }
  return {
    id: chat.id,
    user: {
      id: chat.userId,
      type: chat.userType as "user" | "anonymous",
    },
    title: chat.title,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    messages: [], // Empty messages array as requested
    metadata: chat.metadata || {},
  };
};