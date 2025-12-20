import { db } from "@/lib/drizzle";
import { chatsSchema } from "@/feature/chats/chats.schema";
import { chatMessages } from "../messages.schema";
import { ChatMessage } from "../messages.types";
import { eq } from "drizzle-orm";
import { getChatById } from "@/feature/chats/operations/chat.find";

export interface MessageSender {
  id: string;
  displayName?: string;
}

export interface SendMessageParams {
  chatId: string;
  content: string;
  sender: MessageSender;
  metadata?: Record<string, unknown>;
}

export const sendMessage = async ({
  chatId,
  content,
  sender,
  metadata = {},
}: SendMessageParams): Promise<ChatMessage> => {
  const timestamp = new Date();

  const chat = await getChatById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  // Verify the user exists
  const { usersSchema } = await import("@/feature/users/users.schema");
  const [user] = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.id, sender.id))
    .limit(1);

  if (!user) {
    throw new Error(`User with ID ${sender.id} not found`);
  }

  const [message] = await db
    .insert(chatMessages)
    .values({
      chatId,
      content,
      userId: sender.id,
      metadata,
      timestamp,
    })
    .returning();
  // await db
  //   .update(chatsSchema)
  //   .set({ updatedAt: timestamp })
  //   .where(eq(chatsSchema.id, chatId));

  return message;
};
