import { pgTable, serial, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const questionsTable = pgTable("questions", {
  id: serial("id").primaryKey(),
  chatId: text("chat_id").notNull(), // Reference to the chat this question belongs to
  question: text("question").notNull(),
  status: text("status").notNull().default("pending"),
  answer: text("answer").notNull().default(""),
  relatedDocuments: jsonb("related_documents")
    .$type<
      Array<{
        id: number;
        title: string;
        description: string;
        url: string;
      }>
    >()
    .notNull()
    .default([]),
  relevantLaws: jsonb("relevant_laws")
    .$type<
      Array<{
        title: string;
        description: string;
      }>
    >()
    .notNull()
    .default([]),
  country: text("country").notNull().default("South Sudan"),
  provider: text("provider").notNull().default("gemini"),
  isRoot: boolean("is_root").notNull().default(false),
  userId: text("user_id"), // Nullable for anonymous users
  userFingerprint: text("user_fingerprint"), // Store fingerprint hash for anonymous users
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
