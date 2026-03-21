import { db } from "@/lib/drizzle";
import { eq, desc } from "drizzle-orm";
import { chatsSchema } from "../chats.schema";
import { ChatSessionWithMessages, type ChatSession } from "../chats.types";
import { toManyResult, toResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult, DbResult } from "@/lib/drizzle/drizzle.types";

export const getUserChats = async (
  userId: string,
  limit: number = 20,
  offset: number = 0,
): Promise<DbManyResult<ChatSession>> => {
  const chats = await db
    .select()
    .from(chatsSchema)
    .where(eq(chatsSchema.userId, userId))
    .orderBy(desc(chatsSchema.updatedAt))
    .limit(limit)
    .offset(offset);
  return toManyResult(chats);
};

export const getChatById = async (
  chatId: string,
): Promise<DbResult<ChatSessionWithMessages>> => {
  const chat = await db.query.chatsSchema.findFirst({
    where: eq(chatsSchema.id, chatId),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.timestamp)],
      },
    },
  });
  return toResult(chat);
};
