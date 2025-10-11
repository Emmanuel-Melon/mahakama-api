import { ChatSession } from '../chat.types';
import { chatSessions } from '../storage';

export interface UpdateChatParams {
  title?: string;
  metadata?: Record<string, any>;
  // Add other updateable fields as needed
}

export const updateChat = async (
  chatId: string,
  updates: UpdateChatParams
): Promise<ChatSession> => {
  const chat = chatSessions[chatId];
  
  if (!chat) {
    throw new Error(`Chat with ID ${chatId} not found`);
  }

  const updatedChat: ChatSession = {
    ...chat,
    ...updates,
    updatedAt: new Date(),
    metadata: {
      ...chat.metadata,
      ...updates.metadata,
    },
  };

  chatSessions[chatId] = updatedChat;
  return updatedChat;
};
