import { Message } from "../../lib/llm/types";
import { systemPrompt } from "../prompts";
import { Question } from "../question.types";
import { updateQuestion, getQuestionById } from "./find";
import { getChatMessages } from "../../chats/operations/getChatMessages";
import { getLLMClient, LLMProviders } from "@/lib/llm/client";
import { aggregateMessages } from "../../chats/aggregate-messages";
import { sendMessage } from "../../chats/operations/sendMessage";
import { createChat } from "../../chats/operations/createChat";
import { createBaseUser } from "../../chats/chat.types";

const LLMClient = getLLMClient(LLMProviders.GEMINI);

export async function processQuestion(
  questionText: string,
  questionId: number,
  chatId?: string
): Promise<{ question: Question; chatId?: string }> {
  let question: Question | null = null;
  let createdChatId = chatId;

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

    // Create a chat message for the processed question
    try {
      // If no chatId was provided, create a new chat
      if (!createdChatId) {
        const newChat = await createChat({
          user: createBaseUser(question.userFingerprint || 'system', 'user'),
          title: `Question: ${questionText.substring(0, 50)}${questionText.length > 50 ? '...' : ''}`,
          metadata: {
            questionId: question.id,
            isQuestionChat: true
          }
        });
        createdChatId = newChat.id;
      }

      // Add the question as a user message
      await sendMessage({
        chatId: createdChatId,
        content: questionText,
        sender: createBaseUser(question.userFingerprint || 'system', 'user'),
        metadata: {
          questionId: question.id,
          isQuestion: true
        }
      });

      // Add the answer as an assistant message
      const sentMessage = await sendMessage({
        chatId: createdChatId,
        content: answer,
        sender: {
          id: 'system',
          type: 'assistant' as const,
          displayName: 'Legal Assistant'
        },
        metadata: {
          questionId: question.id,
          isAnswer: true,
          relatedDocuments,
          relevantLaws
        }
      });
      console.log("sentMessage", sentMessage)
    } catch (error) {
      console.error('Error creating chat messages for question:', error);
      // Don't fail the whole operation if chat creation/messaging fails
    }

    return { question: updatedQuestion, chatId: createdChatId };
  } catch (error) {
    console.error(`Error processing question ${questionId}:`, error);

    // Try to update the question status to failed
    try {
      await updateQuestion(questionId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } catch (updateError) {
      console.error('Failed to update question status to failed:', updateError);
    }

    throw error; // Re-throw to be handled by the caller
  }
}
