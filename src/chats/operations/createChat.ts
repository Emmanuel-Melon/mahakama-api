import { v4 as uuidv4 } from 'uuid';
import { ChatSession, BaseUser, ChatMessage, createBaseUser } from '../chat.types';
import { chatSessions } from '../storage';

interface CreateChatParams {
  title: string;
  initialMessage?: string;
  metadata?: Record<string, any>;
  user?: BaseUser;
}

export const createChat = async (input: CreateChatParams): Promise<ChatSession> => {
  const chatId = uuidv4();
  const now = new Date();
  
  // Create a default user if none provided
  const user = input.user || createBaseUser(
    input.metadata?.fingerprint || uuidv4(),
    input.metadata?.userId ? 'user' : 'anonymous'
  );
  
  const newChat: ChatSession = {
    id: chatId,
    user,
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
