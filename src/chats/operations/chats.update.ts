import { db } from "../../lib/drizzle";
import { chatSessions, chatMessages } from "../chats.schema";
import { eq } from "drizzle-orm";
import { type ChatSession } from "../chats.schema";
import { SenderType } from "../chats.types";

export interface UpdateChatParams {
  title?: string;
  metadata?: Record<string, any>;
}

export const updateChat = async (
  chatId: string,
  updates: UpdateChatParams,
): Promise<ChatSession> => {
  try {
    // First, get the current chat to ensure it exists
    const [existingChat] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, chatId))
      .limit(1);

    if (!existingChat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    // Prepare the update data
    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
    };

    // Handle metadata merge
    if (updates.metadata) {
      updateData.metadata = {
        ...((existingChat.metadata as Record<string, any>) || {}),
        ...updates.metadata,
      };
    }

    // Update the chat in the database
    const [updatedChat] = await db
      .update(chatSessions)
      .set(updateData)
      .where(eq(chatSessions.id, chatId))
      .returning();

    // Get the messages for this chat
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.chatId, chatId))
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
      id: updatedChat.id,
      title: updatedChat.title,
      user: {
        id: updatedChat.userId,
        type: updatedChat.senderType as SenderType,
      },
      messages: formattedMessages,
      metadata: updatedChat.metadata || {},
      createdAt: updatedChat.createdAt,
      updatedAt: updatedChat.updatedAt,
    };
  } catch (error) {
    console.error(`Error updating chat ${chatId}:`, error);
    throw error;
  }
};
