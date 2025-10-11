import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { questionsTable } from "./question.schema";

export const createQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  relatedDocuments: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      url: z.string(),
    }),
  ),
  relevantLaws: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
  country: z.string().default("South Sudan"),
  provider: z.string().default("gemini"),
});

export const questionResponseSchema = createSelectSchema(questionsTable);

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type Question = z.infer<typeof questionResponseSchema>;
export type NewQuestion = typeof questionsTable.$inferInsert;
