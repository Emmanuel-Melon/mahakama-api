import { db } from "@/lib/drizzle";
import { chatsSchema, chatMessages, type ChatSession } from "../chats.schema";
import { eq } from "drizzle-orm";
import { usersSchema } from "@/feature/users/users.schema";
import type { User } from "@/feature/users/users.schema";

type ChatWithUser = {
  chat: ChatSession & {
    messages: Array<{
      id: string;
      content: string;
      senderId: string;
      senderType: string;
      timestamp: Date;
      metadata: Record<string, unknown> | null;
    }>;
  };
  user: Pick<User, "id" | "name" | "role"> | null;
};

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

export const getChat = async (
  chatId: string,
  userId?: string,
): Promise<ChatWithUser | null> => {
  const chat = await getChatById(chatId);
  if (!chat) {
    return null;
  }
  const [user] = await db
    .select({
      id: usersSchema.id,
      name: usersSchema.name,
      role: usersSchema.role,
    })
    .from(usersSchema)
    .where(eq(usersSchema.id, chat.userId));

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.chatId, chatId))
    .orderBy(chatMessages.timestamp);

  return {
    chat: {
      ...chat,
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        senderType: msg.senderType,
        timestamp: msg.timestamp,
        metadata: msg.metadata,
      })),
    },
    user: user || null,
  } as unknown as ChatWithUser;
};
