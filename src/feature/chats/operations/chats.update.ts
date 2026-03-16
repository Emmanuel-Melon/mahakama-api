import { db } from "@/lib/drizzle";
import { chatsSchema } from "../chats.schema";
import { and, eq } from "drizzle-orm";
import { type ChatSession } from "../chats.types";

export interface UpdateChatParams {
  id: string;
  userId: string;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
}

export async function updateChat({
  id,
  userId,
  title,
  metadata,
}: UpdateChatParams): Promise<ChatSession | null> {
  const [updatedChat] = await db
    .update(chatsSchema)
    .set({
      title: title ?? undefined,
      metadata: metadata ?? undefined,
      updatedAt: new Date(),
    })
    .where(and(eq(chatsSchema.id, id), eq(chatsSchema.userId, userId)))
    .returning();

  return updatedChat || null;
}

export async function deleteChat(
  chatId: string,
  userId: string,
): Promise<boolean> {
  const [deletedChat] = await db
    .delete(chatsSchema)
    .where(and(eq(chatsSchema.id, chatId), eq(chatsSchema.userId, userId)))
    .returning({ id: chatsSchema.id });

  return !!deletedChat;
}
