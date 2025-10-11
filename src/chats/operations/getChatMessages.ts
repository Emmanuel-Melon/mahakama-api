import { ChatMessage } from "../chat.types";
import { chatSessions } from "../storage";

export const getChatMessages = async (
  chatId: string,
): Promise<ChatMessage[]> => {
  const chat = chatSessions[chatId];
  return chat ? chat.messages : [];
};
