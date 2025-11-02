import { db } from "../../lib/drizzle";
import {
  chatSessions,
  chatMessages,
  type ChatSessionAttrs,
  type ChatSession,
} from "../chat.schema";
import { sendMessage } from "./message.send";
import { SenderType } from "../chat.types";
import { User } from "../../users/users.schema";

export const createChat = async (
  chatAttrs: ChatSessionAttrs,
  user: User,
): Promise<ChatSession> => {
  const now = new Date();
  try {
    const [newChat] = await db
      .insert(chatSessions)
      .values({
        userId: user.id,
        senderType: SenderType.USER,
        title: chatAttrs?.message,
      })
      .returning();

    // if (chatAttrs.message) {
    //   const [newMessage] = await db
    //     .insert(chatMessages)
    //     .values({
    //       chatId: newChat.id,
    //       content: chatAttrs.message,
    //       senderId: user.id,
    //       senderType: SenderType.USER,
    //       senderDisplayName: "User",
    //       timestamp: now,
    //       metadata: {},
    //     })
    //     .returning();

    //   await sendMessage({
    //     chatId: newChat.id,
    //     content: chatAttrs.message,
    //     sender: {
    //       id: "system",
    //       type: "assistant" as const,
    //       displayName: "Assistant",
    //     },
    //     timestamp: now,
    //     metadata: {},
    //   });
    // }

    return newChat;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw new Error("Failed to create chat. Please try again.");
  }
};
