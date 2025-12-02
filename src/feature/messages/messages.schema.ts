import { any, z } from "zod";
import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { usersSchema } from "../../users/users.schema";
import { SenderType, SenderTypeEnum } from "../chats/chats.types";
import { chatsSchema } from "../chats/chats.schema";

// Chat Messages Table
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    chatId: uuid("chat_id").notNull(),
    content: text("content").notNull(),
    senderId: uuid("sender_id"),
    senderType: SenderTypeEnum("sender_type")
      .notNull()
      .default(SenderType.USER),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    metadata: jsonb("metadata").default({}).$type<Record<string, unknown>>(),
  },
  (table) => ({
    chatReference: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chatsSchema.id],
      name: "fk_message_chat",
    }).onDelete("cascade"),
    senderReference: foreignKey({
      columns: [table.senderId],
      foreignColumns: [usersSchema.id],
      name: "fk_message_sender",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
);

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chatsSchema, {
    fields: [chatMessages.chatId],
    references: [chatsSchema.id],
  }),
  sender: one(usersSchema, {
    fields: [chatMessages.senderId],
    references: [usersSchema.id],
  }),
}));


const messageSchema = z.object(any)

// Schema for API responses
export const chatMessageResponseSchema = createSelectSchema(chatMessages);

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

export type SendMessageAttrs = z.infer<typeof messageSchema>;
export type ChatMessageResponse = z.infer<typeof chatMessageResponseSchema>;
