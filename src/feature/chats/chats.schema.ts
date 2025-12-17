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

// Define sender type enum
export const SenderType = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export type SenderType = (typeof SenderType)[keyof typeof SenderType];

export const senderTypeEnum = pgEnum(
  "sender_type",
  Object.values(SenderType) as [string, ...string[]],
);

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

// Relations
export const chatSchemaRelations = relations(chatsSchema, ({ one }) => ({
  user: one(usersSchema, {
    fields: [chatsSchema.userId],
    references: [usersSchema.id],
  }),
}));

// Schema for API responses
export const chatSessionResponseSchema = createSelectSchema(chatsSchema);

export type ChatSession = typeof chatsSchema.$inferSelect;
export type NewChatSession = typeof chatsSchema.$inferInsert;

export type SendMessageAttrs = z.infer<typeof sendMessageSchema>;
export type ChatSessionAttrs = z.infer<typeof chatsSchema>;
export type ChatSessionResponse = z.infer<typeof chatSessionResponseSchema>;
