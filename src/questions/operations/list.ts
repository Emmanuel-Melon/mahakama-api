import { db } from "../../lib/drizzle";
import { questionsTable } from "../question.schema";
import { Question } from "../question.types";
import { desc, sql } from "drizzle-orm";

type ListQuestionsOptions = {
  limit?: number;
  offset?: number;
};

export async function listQuestions({
  limit = 10,
  offset = 0,
}: ListQuestionsOptions = {}): Promise<{ data: Question[]; total: number }> {
  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(questionsTable);

  const questions = await db
    .select()
    .from(questionsTable)
    .orderBy(desc(questionsTable.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    data: questions.map((q) => ({
      ...q,
      relatedDocuments: q.relatedDocuments || [],
      relevantLaws: q.relevantLaws || [],
    })),
    total: Number(count?.count) || 0,
  };
}
