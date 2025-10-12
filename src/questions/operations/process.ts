import { Message } from "../../lib/llm/types";
import { systemPrompt } from "../prompts";
import { Question } from "../question.types";
import { updateQuestion, getQuestionById } from "./find";
import { getChatMessages } from "../../chats/operations/getChatMessages";
import { getLLMClient, LLMProviders } from "@/lib/llm/client";
import { aggregateMessages } from "../../chats/aggregate-messages";

const LLMClient = getLLMClient(LLMProviders.GEMINI);

export async function processQuestion(
  questionText: string,
  questionId: number,
): Promise<Question> {
  let question: Question | null = null;

  try {
    question = await getQuestionById(questionId);
    if (!question) {
      throw new Error(`Question with ID ${questionId} not found`);
    }

    await updateQuestion(questionId, { status: "processing" });

    const chatMessages = await getChatMessages(question.chatId);
    const messages: Message[] = [
      { role: "system" as const, content: systemPrompt },
      ...aggregateMessages(chatMessages),
      { role: "user" as const, content: questionText },
    ];
    const response = await LLMClient.createChatCompletion(messages);
    const content = response.content;

    // Parse the response to extract the answer, related documents, and relevant laws
    let answer = content;
    let relatedDocuments = [];
    let relevantLaws = [];

    try {
      const documentsMatch = content.match(
        /<<<DOCUMENTS>>>\s*\[([\s\S]*?)\]\s*<<<LAWS>>>/,
      );
      const lawsMatch = content.match(/<<<LAWS>>>\s*\[([\s\S]*?)\]\s*$/);

      if (documentsMatch) {
        answer = content.split("<<<DOCUMENTS>>>")[0].trim();
        relatedDocuments = JSON.parse(`[${documentsMatch[1].trim()}]`);
      }

      if (lawsMatch) {
        relevantLaws = JSON.parse(`[${lawsMatch[1].trim()}]`);
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      // Fallback to default data if parsing fails
      relatedDocuments = [
        {
          id: 1,
          title: "Legal Resources Guide",
          description: "General legal resources and information",
          url: "/legal-database/1",
        },
      ];
      relevantLaws = [
        {
          title: "General Legal Principles",
          description: "Basic legal principles and procedures",
        },
      ];
    }

    // Update the question with the response
    const updatedQuestion = await updateQuestion(questionId, {
      answer,
      relatedDocuments,
      relevantLaws,
      status: "completed",
    });

    return updatedQuestion;
  } catch (error) {
    console.error(`Error processing question ${questionId}:`, error);

    // Update question status to failed
    await updateQuestion(questionId, {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    throw error; // Re-throw to be handled by the caller
  }
}
