import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersSchema } from "@/feature/users/users.schema";
import { chatsSchema } from "../chats/chats.schema";

// Chat Messages Table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatsSchema.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
  metadata: jsonb("metadata")
    .notNull()
    .default({})
    .$type<Record<string, unknown>>(),
});

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chatsSchema, {
    fields: [chatMessages.chatId],
    references: [chatsSchema.id],
  }),
  user: one(usersSchema, {
    fields: [chatMessages.userId],
    references: [usersSchema.id],
  }),
}));

export const combinedMessagesSchema = {
  chatMessages,
  chatMessagesRelations,
};
