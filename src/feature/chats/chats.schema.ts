import { z } from "zod";
import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { usersSchema } from "@/feature/users/users.schema";
import { SenderType, SenderTypeEnum, sendMessageSchema } from "./chats.types";


// Chat Sessions Table
export const chatsSchema = pgTable(
  "chat_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    title: text("title").default("Untitled Chat"),
    metadata: jsonb("metadata").default({}).$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userReference: foreignKey({
      columns: [table.userId],
      foreignColumns: [usersSchema.id],
      name: "fk_chat_user",
    }),
  }),
);

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

// Relations
export const chatSchemaRelations = relations(
  chatsSchema,
  ({ many, one }) => ({
    messages: many(chatMessages),
    user: one(usersSchema, {
      fields: [chatsSchema.userId],
      references: [usersSchema.id],
    }),
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

// Schema for API responses
export const chatSessionResponseSchema = createSelectSchema(chatsSchema);

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

export type ChatSession = typeof chatsSchema.$inferSelect;
export type NewChatSession = typeof chatsSchema.$inferInsert;

export type SendMessageAttrs = z.infer<typeof sendMessageSchema>;
export type ChatSessionAttrs = z.infer<typeof chatsSchema>;
export type ChatSessionResponse = z.infer<typeof chatSessionResponseSchema>;
