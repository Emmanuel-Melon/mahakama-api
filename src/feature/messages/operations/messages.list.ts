import { db } from "../../../lib/drizzle";
import {
    chatMessages,
    type ChatMessage,
} from "../messages.schema";
import { eq } from "drizzle-orm";
import { MessageRole, LLMMessage } from "../../../lib/llm/llms.types";

export const getMessagesByChatId = async (chatId: string): Promise<Pick<ChatMessage, "content" | "senderType" | "timestamp">[]> => {
    const messages = await db
        .select({
            content: chatMessages.content,
            senderType: chatMessages.senderType,
            timestamp: chatMessages.timestamp,
        })
        .from(chatMessages)
        .where(eq(chatMessages.chatId, chatId))
        .orderBy(chatMessages.timestamp);
    return messages;
};

export const getMessagesForLLM = async (
    chatId: string,
    options?: {
        limit?: number;
        includeSystem?: boolean;
    }
): Promise<LLMMessage[]> => {
    const messages = await db
        .select({
            senderType: chatMessages.senderType,
            content: chatMessages.content,
        })
        .from(chatMessages)
        .where(eq(chatMessages.chatId, chatId))
        .orderBy(chatMessages.timestamp);
    const formattedMessages = messages.map(msg => ({
        role: msg.senderType as MessageRole,
        content: msg.content
    }));

    if (options?.limit) {
        return formattedMessages.slice(-options.limit);
    }
    return formattedMessages;
};