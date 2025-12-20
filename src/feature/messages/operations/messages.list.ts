import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import { ChatMessage } from "../messages.types";
import { eq } from "drizzle-orm";
import { MessageRole, LLMMessage } from "../../../lib/llm/llms.types";
import { usersSchema } from "@/feature/users/users.schema";

export const getMessagesByChatId = async (
  chatId: string,
): Promise<ChatMessage[]> => {
  const messages = await db
    .select({
      id: chatMessages.id,
      chatId: chatMessages.chatId,
      content: chatMessages.content,
      userId: chatMessages.userId,
      timestamp: chatMessages.timestamp,
      metadata: chatMessages.metadata,
      user: {
        id: usersSchema.id,
        name: usersSchema.name,
        email: usersSchema.email,
        role: usersSchema.role,
      },
    })
    .from(chatMessages)
    .leftJoin(usersSchema, eq(chatMessages.userId, usersSchema.id))
    .where(eq(chatMessages.chatId, chatId))
    .orderBy(chatMessages.timestamp);
  return messages;
};

export const getMessagesForLLM = async (
  chatId: string,
  options?: {
    limit?: number;
    includeSystem?: boolean;
  },
): Promise<LLMMessage[]> => {
  const messages = await db
    .select({
      userId: chatMessages.userId,
      content: chatMessages.content,
      userRole: usersSchema.role,
    })
    .from(chatMessages)
    .leftJoin(usersSchema, eq(chatMessages.userId, usersSchema.id))
    .where(eq(chatMessages.chatId, chatId))
    .orderBy(chatMessages.timestamp);

  const formattedMessages = messages.map((msg: any) => ({
    role: (msg.userRole === "assistant" ? "assistant" : "user") as MessageRole,
    content: msg.content,
  }));

  if (options?.limit) {
    return formattedMessages.slice(-options.limit);
  }
  return formattedMessages;
};
