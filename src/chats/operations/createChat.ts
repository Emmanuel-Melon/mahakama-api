import { v4 as uuidv4 } from 'uuid';
import { ChatSession, BaseUser, ChatMessage } from '../chat.types';
import { chatSessions } from '../storage';

interface CreateChatParams {
  user: BaseUser;
  title: string;
  initialMessage?: string;
  metadata?: Record<string, any>;
}

export const createChat = async (input: CreateChatParams): Promise<ChatSession> => {
  const chatId = uuidv4();
  const now = new Date();
  
  const newChat: ChatSession = {
    id: chatId,
    user: input.user,
    title: input.title,
    createdAt: now,
    updatedAt: now,
    messages: [],
    metadata: input.metadata || {},
  };

  // Add initial message if provided
  if (input.initialMessage) {
    const message: ChatMessage = {
      id: uuidv4(),
      content: input.initialMessage,
      sender: {
        id: 'system',
        type: 'assistant',
        displayName: 'Assistant'
      },
      timestamp: now,
      metadata: {},
    };
    newChat.messages.push(message);
  }

  chatSessions[chatId] = newChat;
  return newChat;
};
