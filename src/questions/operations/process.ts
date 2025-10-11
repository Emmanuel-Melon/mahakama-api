import { GeminiClient } from "../../lib/llm/gemini";
import { Message } from "../../lib/llm/types";
import { systemPrompt } from "../prompts";
import { Question } from "../question.types";
import { updateQuestion } from "./find";

const geminiClient = new GeminiClient();

export async function processQuestion(questionText: string, questionId: number): Promise<Question> {
  try {
    // Update status to processing
    await updateQuestion(questionId, { status: "processing" });

    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: questionText },
    ];

    // Get response from Gemini
    const response = await geminiClient.createChatCompletion(messages);
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
