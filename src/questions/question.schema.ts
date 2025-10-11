import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const questionsTable = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
