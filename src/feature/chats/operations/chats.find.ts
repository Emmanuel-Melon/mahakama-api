import { db } from "@/lib/drizzle";
import { eq, desc } from "drizzle-orm";
import { chatsSchema } from "../chats.schema";
import { type ChatSession } from "../chats.types";

export const getUserChats = async (
  userId: string,
  limit: number = 20,
  offset: number = 0,
): Promise<ChatSession[]> => {
  const chats = await db
    .select()
    .from(chatsSchema)
    .where(eq(chatsSchema.userId, userId))
    .orderBy(desc(chatsSchema.updatedAt))
    .limit(limit)
    .offset(offset);
  return chats;
};
