import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { chatsSchema } from "../chats.schema";
import { type ChatSessionWithMessages } from "../chats.types";

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
