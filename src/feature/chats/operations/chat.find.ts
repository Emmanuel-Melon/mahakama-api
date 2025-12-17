import { db } from "@/lib/drizzle";
import { chatsSchema, type ChatSession } from "../chats.schema";
import { eq } from "drizzle-orm";

export const getChatById = async (
  chatId: string,
): Promise<ChatSession | null> => {
  const [chat] = await db
    .select()
    .from(chatsSchema)
    .where(eq(chatsSchema.id, chatId))
    .limit(1);

  return chat || null;
};
