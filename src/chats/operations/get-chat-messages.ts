import { db } from "../../lib/drizzle";
import { chatMessages } from "../chat.schema";
import { eq } from "drizzle-orm";
import { type ChatSessionResponse } from "../chat.schema";
import { SenderType } from "../chat.types";

export const getChatMessages = async (chatId: string): Promise<any[]> => {
  try {
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.chatId, chatId))
      .orderBy(chatMessages.timestamp);

    return messages.map((msg) => ({
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
  } catch (error) {
    console.error(`Error fetching messages for chat ${chatId}:`, error);
    throw new Error("Failed to fetch chat messages");
  }
};
