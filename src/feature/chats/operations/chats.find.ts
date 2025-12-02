import { db } from "@/lib/drizzle";
import { chatsSchema, chatMessages } from "../chats.schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import type { ChatSession } from "../chats.schema";

export interface ChatWithLastMessage extends ChatSession {
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  messageCount: number;
}

export const getUserChats = async (
  userId: string,
  limit: number = 20,
  offset: number = 0,
): Promise<ChatWithLastMessage[]> => {
  // Get chats with message counts
  const chats = await db
    .select({
      id: chatsSchema.id,
      userId: chatsSchema.userId,
      title: chatsSchema.title,
      metadata: chatsSchema.metadata,
      createdAt: chatsSchema.createdAt,
      updatedAt: chatsSchema.updatedAt,
      messageCount: sql<number>`count(${chatMessages.id})`,
    })
    .from(chatsSchema)
    .leftJoin(chatMessages, eq(chatMessages.chatId, chatsSchema.id))
    .where(eq(chatsSchema.userId, userId))
    .groupBy(
      chatsSchema.id,
      chatsSchema.userId,
      chatsSchema.title,
      chatsSchema.metadata,
      chatsSchema.createdAt,
      chatsSchema.updatedAt,
    )
    .orderBy(desc(chatsSchema.updatedAt))
    .limit(limit)
    .offset(offset);

  // Get the last message for each chat
  const chatIds = chats.map((chat) => chat.id);
  const lastMessages =
    chatIds.length > 0
      ? await db
          .select({
            chatId: chatMessages.chatId,
            content: chatMessages.content,
            timestamp: chatMessages.timestamp,
          })
          .from(chatMessages)
          .where(
            and(
              inArray(chatMessages.chatId, chatIds),
              sql`${chatMessages.timestamp} = (
          SELECT MAX(timestamp) 
          FROM ${chatMessages} 
          WHERE chat_id = ${chatMessages.chatId}
        )`,
            ),
          )
          .then(
            (messages) =>
              new Map(
                messages.map((msg) => [
                  msg.chatId,
                  {
                    content: msg.content,
                    timestamp: msg.timestamp,
                  },
                ]),
              ),
          )
      : new Map();

  // Combine the data
  return chats.map((chat) => ({
    ...chat,
    messageCount: Number(chat.messageCount) || 0,
    lastMessage: lastMessages.get(chat.id),
  }));
};
