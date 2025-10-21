import { Request, Response, NextFunction } from "express";
import { GeminiClient } from "../../lib/llm/gemini";
import { Message } from "../../lib/llm/types";
import { systemPrompt } from "../prompts";
import { getQuestionById, updateQuestion } from "../operations/find";
import { QuestionStatus } from "../question.types";
import { ApiError, NotFoundError } from "../../middleware/errors";

const geminiClient = new GeminiClient();

export const processQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const questionId = parseInt(id);

    if (isNaN(questionId)) {
      throw new ApiError("Invalid question ID", 400, "INVALID_QUESTION_ID");
    }

    // Get the question from the database
    const question = await getQuestionById(questionId);

    if (!question) {
      throw new NotFoundError("Question", { id: questionId });
    }

    // Update status to processing
    await updateQuestion(questionId, { status: "processing" });

    // Process the question in the background
    processQuestionInBackground(questionId, question.question);

    return res.status(202).json({
      success: true,
      data: {
        ...question,
        status: "processing",
        message: "Question is being processed",
      },
    });
  } catch (error) {
    next(error);
  }
};

async function processQuestionInBackground(
  questionId: number,
  questionText: string,
) {
  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: questionText },
  ];

  try {
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
    await updateQuestion(questionId, {
      answer,
      relatedDocuments,
      relevantLaws,
      status: "completed" as QuestionStatus,
    });

    console.log(`Successfully processed question ${questionId}`);
  } catch (error) {
    console.error(`Error processing question ${questionId}:`, error);

    // Update question status to failed
    await updateQuestion(questionId, {
      status: "failed" as QuestionStatus,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
