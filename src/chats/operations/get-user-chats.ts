import { db } from "../../lib/drizzle";
import { chatSessions, chatMessages } from "../chat.schema";
import { eq, and, or, desc } from "drizzle-orm";
import { type ChatSession } from "../chat.schema";
import { SenderType } from "../chat.types";

export const getUserChats = async (
  fingerprint: string,
): Promise<ChatSession[]> => {
  try {
    const allChats = await db
      .select()
      .from(chatSessions)
      .orderBy(desc(chatSessions.updatedAt));

    const userChats = allChats.filter((chat) => {
      return (
        chat.userId === fingerprint ||
        (chat.metadata as any)?.fingerprint === fingerprint
      );
    });

    const chatsWithMessages = await Promise.all(
      userChats.map(async (chat) => {
        const messages = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.chatId, chat.id))
          .orderBy(chatMessages.timestamp);

        // Transform messages to match ChatMessage type
        const formattedMessages = messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          sender: {
            id: msg.senderId,
            type: (msg.senderType === "system"
              ? "assistant"
              : msg.senderType) as SenderType,
            displayName: msg.senderDisplayName || undefined,
          },
          metadata: msg.metadata || {},
          questionId: msg.questionId || undefined,
        }));

        return {
          id: chat.id,
          title: chat.title,
          user: {
            id: chat.userId,
            type: chat.senderType as SenderType,
          },
          messages: formattedMessages,
          metadata: chat.metadata || {},
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        };
      }),
    );

    return chatsWithMessages;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw new Error("Failed to fetch user chats");
  }
};
