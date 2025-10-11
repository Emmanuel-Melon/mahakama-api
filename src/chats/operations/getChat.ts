import { ChatSession } from '../chat.types';
import { chatSessions } from '../storage';

export const getChat = async (chatId: string): Promise<ChatSession | null> => {
  return chatSessions[chatId] || null;
};
