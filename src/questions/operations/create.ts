import { db } from "../../lib/drizzle";
import { questionsTable } from "../question.schema";
import { NewQuestion, Question } from "../question.types";

export async function createQuestion(
  questionData: NewQuestion,
): Promise<Question> {
  const [newQuestion] = await db
    .insert(questionsTable)
    .values({
      question: questionData.question,
      answer: questionData.answer,
      relatedDocuments: questionData.relatedDocuments || [],
      relevantLaws: questionData.relevantLaws || [],
      country: questionData.country || "South Sudan",
      provider: questionData.provider || "gemini",
    })
    .returning();

  return {
    ...newQuestion,
    relatedDocuments: newQuestion.relatedDocuments || [],
    relevantLaws: newQuestion.relevantLaws || [],
  };
}
