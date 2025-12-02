import { db } from "../../../lib/drizzle";
import { chatsSchema, chatMessages, type ChatMessage } from "../../chats/chats.schema";
import { eq } from "drizzle-orm";
import { getChatById } from "../../chats/operations/chat.find";

export interface MessageSender {
  id: string;
  type: "user" | "assistant" | "system";
  displayName?: string;
}

export interface SendMessageParams {
  chatId: string;
  content: string;
  sender: MessageSender;
  metadata?: Record<string, unknown>;
}

export const sendMessage = async ({
  chatId,
  content,
  sender,
  metadata = {},
}: SendMessageParams): Promise<ChatMessage> => {
  const timestamp = new Date();

  // Verify chat exists
  const chat = await getChatById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  // Insert the new message
  const [message] = await db
    .insert(chatMessages)
    .values({
      chatId,
      content,
      senderId: sender.id,
      senderType: sender.type,
      metadata,
      timestamp,
    })
    .returning();

  // Update the chat's updatedAt timestamp
  await db
    .update(chatsSchema)
    .set({ updatedAt: timestamp })
    .where(eq(chatsSchema.id, chatId));

  return message;
};
