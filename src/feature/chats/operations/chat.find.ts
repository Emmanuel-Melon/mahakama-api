import { db } from "@/lib/drizzle";
import { chatsSchema, type ChatSessionWithMessages } from "../chats.schema";
import { eq } from "drizzle-orm";

export const getChatById = async (
  chatId: string,
): Promise<ChatSessionWithMessages | null> => {
  const chat = await db.query.chatsSchema.findFirst({
    where: eq(chatsSchema.id, chatId),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.timestamp)],
      },
    },
  });
  return chat || null;
};
