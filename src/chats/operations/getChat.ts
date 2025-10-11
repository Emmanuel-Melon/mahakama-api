import { ChatSession, ChatMessage } from "../chat.types";
import { chatSessions } from "../storage";

export const getChat = async (chatId: string): Promise<ChatSession | null> => {
  return chatSessions[chatId] || null;
};

export const getChatMessages = async (
  chatId: string,
): Promise<ChatMessage[]> => {
  const chat = await getChat(chatId);
  if (!chat) {
    throw new Error(`Chat with ID ${chatId} not found`);
  }
  return chat.messages;
};
