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
import { usersSchema } from "@/feature/users/users.schema";
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

export const chatSchemaRelations = relations(chatsSchema, ({ one, many }) => ({
  user: one(usersSchema, {
    fields: [chatsSchema.userId],
    references: [usersSchema.id],
  }),
  messages: many(chatMessages),
}));

export const combinedChatsSchema = {
  usersSchema,
  chatSchemaRelations,
};
