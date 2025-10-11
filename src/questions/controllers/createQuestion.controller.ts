import { Request, Response, NextFunction } from "express";
import { createQuestion } from "../operations/create";
import { processQuestion } from "../operations/process";
import { CreateQuestionInput } from "../question.types";
import { ApiError } from "../../middleware/errors";
import { createChat } from "../../chats/operations/createChat";
import { getChat } from "../../chats/operations/getChat";
import { updateChat } from "../../chats/operations/updateChat";
import { RequestFingerprint } from "../../middleware/fingerprint";
export const createQuestionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { question, country = "South Sudan", chatId: existingChatId } = req.body;
    
    // Get user ID from auth or use fingerprint for anonymous users
    const userId = req.user?.id;
    const fingerprint = req.fingerprint;
    
    if (!fingerprint) {
      throw new ApiError(
        "Fingerprint is required",
        400,
        "MISSING_FINGERPRINT"
      );
    }

    if (!question) {
      throw new ApiError(
        "Question is required",
        400,
        "MISSING_QUESTION"
      );
    }

    let chat;
    let chatId = existingChatId;
    
    // If no chatId provided, create a new chat
    if (!chatId) {
      chat = await createChat({
        title: question.slice(0, 50) + (question.length > 50 ? '...' : ''),
        initialMessage: question,
        metadata: { 
          country,
          fingerprint: fingerprint.hash,
          ...(userId && { userId })
        }
      });
      chatId = chat.id;
    } else {
      // Get existing chat to ensure it exists
      chat = await getChat(chatId);
      if (!chat) {
        throw new ApiError("Chat not found", 404, "CHAT_NOT_FOUND");
      }

      // Verify the fingerprint matches for anonymous users
      if (!userId && chat.metadata?.fingerprint !== fingerprint.hash) {
        throw new ApiError("Unauthorized access to chat", 403, "UNAUTHORIZED_CHAT_ACCESS");
      }
    }

    // Create a new question with 'pending' status
    const questionData: CreateQuestionInput = {
      chatId,
      question,
      status: "pending",
      country,
      provider: "gemini",
      answer: "",
      relatedDocuments: [],
      relevantLaws: [],
      isRoot: chat.messages.length === 0,
      ...(userId && { userId }),
      userFingerprint: fingerprint.hash
    };

    const createdQuestion = await createQuestion(questionData);
    
    // If this is a new chat, update the chat's rootQuestionId
    if (!existingChatId) {
      await updateChat(chatId, {
        metadata: {
          ...chat.metadata,
          rootQuestionId: createdQuestion.id
        }
      });
    }
    
    // Start processing the question in the background
    processQuestion(question, createdQuestion.id)
      .catch(error => {
        console.error(`Background processing failed for question ${createdQuestion.id}:`, error);
      });

    return res.status(201).json({
      ...createdQuestion,
      status: "processing",
      message: "Question is being processed",
    });
  } catch (error) {
    next(error);
  }
};
