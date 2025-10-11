import { db } from "../../lib/drizzle";
import { questionsTable } from "../question.schema";
import { Question, QuestionStatus } from "../question.types";
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

export async function getQuestionById(id: number): Promise<Question> {
  const question = await findQuestionById(id);
  if (!question) {
    throw new Error(`Question with ID ${id} not found`);
  }
  return question;
}

export async function updateQuestion(
  id: number,
  data: Partial<{
    question: string;
    answer: string;
    status: QuestionStatus;
    relatedDocuments: Array<{
      id: number;
      title: string;
      description: string;
      url: string;
    }>;
    relevantLaws: Array<{
      title: string;
      description: string;
    }>;
    country: string;
    provider: string;
    error?: string;
  }>,
): Promise<Question> {
  const [updatedQuestion] = await db
    .update(questionsTable)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(questionsTable.id, id))
    .returning();

  if (!updatedQuestion) {
    throw new Error(`Failed to update question with ID ${id}`);
  }

  return {
    ...updatedQuestion,
    relatedDocuments: updatedQuestion.relatedDocuments || [],
    relevantLaws: updatedQuestion.relevantLaws || [],
  };
}

export async function findQuestionByQuestion(
  questionText: string,
): Promise<Question | null> {
  const [question] = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.question, questionText));

  if (!question) return null;

  return {
    ...question,
    relatedDocuments: question.relatedDocuments || [],
    relevantLaws: question.relevantLaws || [],
  };
}
