import { db } from "@/lib/drizzle";
import { chatsSchema } from "../chats.schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import type { ChatSession } from "../chats.schema";

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
