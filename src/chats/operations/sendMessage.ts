import { db } from "../../lib/drizzle";
import { chatSessions, chatMessages } from "../chat.schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage, AddMessageInput } from "../chat.types";

export const sendMessage = async (
  input: AddMessageInput,
): Promise<ChatMessage> => {
  const { chatId, content, sender, questionId, metadata } = input;
  const messageId = uuidv4();
  const timestamp = new Date();

  return db.transaction(async (tx) => {
    // Verify chat exists and get current metadata
    const [chat] = await tx
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, chatId))
      .limit(1);

    if (!chat) {
      throw new Error("Chat not found");
    }

    // Insert the new message
    await tx.insert(chatMessages).values({
      id: messageId,
      chatId,
      content,
      senderId: sender.id,
      senderType: sender.type,
      senderDisplayName: 'displayName' in sender ? (sender as any).displayName : null,
      timestamp,
      questionId,
      metadata: metadata || {},
    });

    // Update the chat's updatedAt timestamp
    await tx
      .update(chatSessions)
      .set({ updatedAt: timestamp })
      .where(eq(chatSessions.id, chatId));

    // Return the created message in the expected format
    return {
      id: messageId,
      content,
      sender,
      timestamp,
      questionId,
      metadata: metadata || {},
    };
  });
};
