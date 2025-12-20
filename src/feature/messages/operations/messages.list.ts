import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import { ChatMessage } from "../messages.types";
import { eq } from "drizzle-orm";
import { MessageRole } from "../../../lib/llm/llms.types";
import { usersSchema } from "@/feature/users/users.schema";

export const getMessagesByChatId = async (
  chatId: string,
): Promise<ChatMessage[]> => {
  const messages = await db.query.chatMessages.findMany({
    where: eq(chatMessages.chatId, chatId),
    orderBy: (chatMessages, { asc }) => [asc(chatMessages.timestamp)],
  });
  return messages;
};
