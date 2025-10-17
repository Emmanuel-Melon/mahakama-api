import { Message } from "../../lib/llm/types";
import { systemPrompt } from "../prompts";
import { Question } from "../question.types";
import { updateQuestion, getQuestionById } from "./find";
import { getChatMessages } from "../../chats/operations/getChatMessages";
import { aggregateMessages } from "../../chats/aggregate-messages";
import { sendMessage } from "../../chats/operations/sendMessage";
import { createChat } from "../../chats/operations/createChat";
import { createBaseUser } from "../../chats/chat.types";
import { answerLegalQuestion } from "@/rag-pipeline/answers/text-generation";

let userMessage: any;
let assistantMessage: any;

export async function processQuestion(
  questionText: string,
  questionId: number,
  chatId?: string,
): Promise<any> {
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
    const { answer } = await answerLegalQuestion(questionText);

    // Update the question with the response
    const updatedQuestion = await updateQuestion(questionId, {
      answer,
      status: "completed",
    });

    // Create a chat message for the processed question
    try {
      // If no chatId was provided, create a new chat
      if (!createdChatId) {
        const newChat = await createChat({
          user: createBaseUser(question.userFingerprint || "system", "user"),
          title: `Question: ${questionText.substring(0, 50)}${questionText.length > 50 ? "..." : ""}`,
          metadata: {
            questionId: question.id,
            isQuestionChat: true,
          },
        });
        createdChatId = newChat.id;
      }

      // Add the question as a user message
      userMessage = await sendMessage({
        chatId: createdChatId,
        content: questionText,
        sender: createBaseUser(question.userFingerprint || "system", "user"),
        metadata: {
          questionId: question.id,
          isQuestion: true,
        },
      });

      // Add the answer as an assistant message
      assistantMessage = await sendMessage({
        chatId: createdChatId,
        content: answer,
        sender: {
          id: "system",
          type: "assistant" as const,
          displayName: "Legal Assistant",
        },
        metadata: {
          questionId: question.id,
          isAnswer: true,
        },
      });
      console.log("userMessage", userMessage);
      console.log("assistantMessage", assistantMessage);
    } catch (error) {
      console.error("Error creating chat messages for question:", error);
      // Don't fail the whole operation if chat creation/messaging fails
    }

    return { assistantMessage, userMessage };
  } catch (error) {
    console.error(`Error processing question ${questionId}:`, error);

    // Try to update the question status to failed
    try {
      await updateQuestion(questionId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } catch (updateError) {
      console.error("Failed to update question status to failed:", updateError);
    }

    throw error; // Re-throw to be handled by the caller
  }
}
