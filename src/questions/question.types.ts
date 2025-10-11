import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { questionsTable } from "./question.schema";

export const QuestionStatus = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
]);

export type QuestionStatus = z.infer<typeof QuestionStatus>;

export const createQuestionSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  question: z.string().min(1, "Question is required"),
  status: QuestionStatus.default("pending"),
  answer: z.string().default(""),
  isRoot: z.boolean().default(false),
  userId: z.string().optional(),
  userFingerprint: z.string().optional(),
  relatedDocuments: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        url: z.string(),
      }),
    )
    .default([]),
  relevantLaws: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .default([]),
  country: z.string().default("South Sudan"),
  provider: z.string().default("gemini"),
});

export const questionResponseSchema = createSelectSchema(questionsTable);

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type Question = z.infer<typeof questionResponseSchema>;
export type NewQuestion = typeof questionsTable.$inferInsert;
