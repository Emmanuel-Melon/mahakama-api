import { ChatMessage, AddMessageInput } from '../chat.types';
import { chatSessions } from '../storage';

export const sendMessage = async (input: AddMessageInput): Promise<ChatMessage> => {
  const { chatId, content, sender, questionId, metadata } = input;
  const chat = chatSessions[chatId];
  
  if (!chat) {
    throw new Error('Chat not found');
  }

  const message: ChatMessage = {
    id: crypto.randomUUID(),
    content,
    sender,
    timestamp: new Date(),
    questionId,
    metadata: metadata || {},
  };

  chat.messages.push(message);
  chat.updatedAt = new Date();
  
  return message;
};
