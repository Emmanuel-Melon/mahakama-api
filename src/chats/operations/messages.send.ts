import { db } from "../../lib/drizzle";
import { chatSessions, chatMessages } from "../chats.schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const sendMessage = async (input: any): Promise<any> => {
  console.log("sending message");
  const { chatId, content, sender, questionId, metadata } = input;
  const messageId = uuidv4();
  const timestamp = new Date();

  // Verify chat exists and get current metadata
  const [chat] = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.id, chatId))
    .limit(1);

  console.log("got chat", chat);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // Insert the new message
  await db.insert(chatMessages).values({
    id: messageId,
    chatId,
    content,
    senderId: sender.id,
    senderType: sender.type,
    senderDisplayName:
      "displayName" in sender ? (sender as any).displayName : null,
    timestamp,
    questionId,
    metadata: metadata || {},
  });

  // Update the chat's updatedAt timestamp
  await db
    .update(chatSessions)
    .set({ updatedAt: timestamp })
    .where(eq(chatSessions.id, chatId));

  // Return the created message in the expected format
  return {
    id: messageId,
    content,
    sender,
    timestamp,
    questionId,
    metadata: metadata || {},
  };
};
