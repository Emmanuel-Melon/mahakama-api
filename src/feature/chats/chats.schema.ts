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
import { sendMessageSchema } from "./chats.types";
import { chatMessages } from "@/feature/messages/messages.schema";
import { SenderType } from "./shared.types";

export const senderTypeEnum = pgEnum(
  "sender_type",
  Object.values(SenderType) as [string, ...string[]],
);

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

// Relations
export const chatSchemaRelations = relations(chatsSchema, ({ one, many }) => ({
  user: one(usersSchema, {
    fields: [chatsSchema.userId],
    references: [usersSchema.id],
  }),
  messages: many(chatMessages),
}));

// Schema for API responses
export const chatSessionResponseSchema = createSelectSchema(chatsSchema);

export type ChatSession = typeof chatsSchema.$inferSelect;
export type NewChatSession = typeof chatsSchema.$inferInsert;
export type ChatSessionWithMessages = ChatSession & {
  messages: (typeof chatMessages.$inferSelect)[];
};

export type SendMessageAttrs = z.infer<typeof sendMessageSchema>;
export type ChatSessionAttrs = z.infer<typeof chatsSchema>;
export type ChatSessionResponse = z.infer<typeof chatSessionResponseSchema>;
