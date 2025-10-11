import { ChatSession } from '../chat.types';
import { chatSessions } from '../storage';

export const getUserChats = async (userId: string): Promise<ChatSession[]> => {
  return Object.values(chatSessions).filter(chat => chat.user.id === userId);
};
