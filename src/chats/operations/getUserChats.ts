import { db } from "../../lib/drizzle";
import { chatSessions, chatMessages } from "../chat.schema";
import { eq, and, or, desc } from "drizzle-orm";
import { ChatSession } from "../chat.types";

export const getUserChats = async (fingerprint: string): Promise<ChatSession[]> => {
  try {
    // First, get all chat sessions for this user (either by userId or fingerprint)
    // First, get all possible chats (we'll filter in memory for metadata)
    const allChats = await db
      .select()
      .from(chatSessions)
      .orderBy(desc(chatSessions.updatedAt));

    // Filter chats in memory to match either userId or metadata.fingerprint
    const userChats = allChats.filter(chat => {
      return (
        chat.userId === fingerprint || 
        (chat.metadata as any)?.fingerprint === fingerprint
      );
    });

    // For each chat, get its messages
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
            type: (msg.senderType === 'system' ? 'assistant' : msg.senderType) as 'user' | 'assistant' | 'anonymous',
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
            type: chat.userType as 'user' | 'anonymous',
          },
          messages: formattedMessages,
          metadata: chat.metadata || {},
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        };
      })
    );

    return chatsWithMessages;
  } catch (error) {
    console.error('Error fetching user chats:', error);
    throw new Error('Failed to fetch user chats');
  }
};
