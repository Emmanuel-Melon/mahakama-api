import { db } from "../../lib/drizzle";
import { questionsTable } from "../question.schema";
import { Question } from "../question.types";
import { eq } from "drizzle-orm";

export async function findQuestionById(id: number): Promise<Question | null> {
  const [question] = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.id, id));

  if (!question) return null;

  return {
    ...question,
    relatedDocuments: question.relatedDocuments || [],
    relevantLaws: question.relevantLaws || [],
  };
}
