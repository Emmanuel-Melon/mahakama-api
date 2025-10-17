// src/chats/operations/getChat.ts
import { db } from "../../lib/drizzle";
import { chatSessions } from "../chat.schema";
import { eq } from "drizzle-orm";
import { ChatSession } from "../chat.types";
import { getChatMessages } from "./getChatMessages";

export const getChat = async (
  chatId: string,
  userId: string,
): Promise<ChatSession | null> => {
  const [chat] = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.id, chatId))
    .limit(1);

  if (!chat) {
    return null;
  }

  if (chat.userId !== userId) {
    throw new Error("Unauthorized: You don't have access to this chat");
  }

  const messages = await getChatMessages(chatId);

  const formattedMessages = messages.map((msg) => ({
    ...msg,
    sender: msg.sender || {
      id: "system",
      type: "assistant" as const,
      displayName: msg.metadata?.isAnswer ? "Legal Assistant" : "Assistant",
    },
    // Ensure consistent metadata
    metadata: {
      ...(chat.metadata || {}),
      ...(msg.metadata || {}),
    },
  }));

  return {
    id: chat.id,
    user: {
      id: chat.userId,
      type: chat.userType as "user" | "anonymous",
    },
    title: chat.title,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    messages: formattedMessages,
    metadata: chat.metadata || {},
  };
};
