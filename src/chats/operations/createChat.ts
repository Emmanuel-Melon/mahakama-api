// src/chats/operations/createChat.ts
import { v4 as uuidv4 } from "uuid";
import { db } from "../../lib/drizzle";
import { chatSessions, chatMessages } from "../chat.schema";
import { ChatSession, CreateChatInput } from "../chat.types";

export const createChat = async (
  input: CreateChatInput,
): Promise<ChatSession> => {
  const now = new Date();
  const chatId = uuidv4();

  try {
    // Create chat session
    const [newChat] = await db
      .insert(chatSessions)
      .values({
        id: chatId,
        userId: input.user.id,
        senderType: input.user.type,
        title: input.title,
        metadata: input.metadata || {},
        createdAt: now,
        updatedAt: now,
        
      })
      .returning();

    const messages = [];

    // Add initial message if provided
    if (input.initialMessage) {
      const messageId = uuidv4();
      await db.insert(chatMessages).values({
        id: messageId,
        chatId,
        content: input.initialMessage,
        senderId: "system",
        senderType: "assistant",
        senderDisplayName: "Assistant",
        timestamp: now,
        metadata: {},
      });

      messages.push({
        id: messageId,
        content: input.initialMessage,
        sender: {
          id: "system",
          type: "assistant" as const,
          displayName: "Assistant",
        },
        timestamp: now,
        metadata: {},
      });
    }

    return {
      id: newChat.id,
      user: input.user,
      title: newChat.title,
      createdAt: newChat.createdAt,
      updatedAt: newChat.updatedAt,
      messages,
      metadata: newChat.metadata || {},
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating chat:", error);
    throw new Error("Failed to create chat. Please try again.");
  }
};
