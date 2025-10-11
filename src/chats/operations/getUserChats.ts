import { ChatSession } from "../chat.types";
import { chatSessions } from "../storage";

export const getUserChats = async (
  fingerprint: string,
): Promise<ChatSession[]> => {
  return Object.values(chatSessions).filter(
    (chat) =>
      chat.metadata?.fingerprint === fingerprint ||
      chat.user.id === fingerprint,
  );
};
