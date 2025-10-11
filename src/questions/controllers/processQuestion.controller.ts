import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../middleware/errors";
import { createQuestion } from "../operations/create";
import { processQuestion as processQuestionOperation } from "../operations/process";
import { v4 as uuidv4 } from "uuid";

// Extend Express Request type to include user and fingerprint
declare global {
  namespace Express {
    interface Request {
      fingerprint?: {
        hash: string;
      };
      user?: {
        id: string;
      };
    }
  }
}

export const processQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { question, country = "South Sudan", chatId } = req.body;

    if (!question) {
      throw new ApiError("Question is required", 400, "MISSING_QUESTION");
    }

    if (!chatId) {
      throw new ApiError("Chat ID is required", 400, "MISSING_CHAT_ID");
    }

    // Get user ID from auth or use fingerprint for anonymous users
    const userId = req.user?.id;
    const userFingerprint = req.fingerprint?.hash;

    const createdQuestion = await createQuestion({
      chatId,
      question,
      status: "pending",
      answer: "",
      relatedDocuments: [],
      relevantLaws: [],
      country,
      provider: "gemini",
      // Include user information if available
      ...(userId && { userId }),
      ...(userFingerprint && { userFingerprint }),
    });

    // Process the question in the background
    processQuestionOperation(question, createdQuestion.id).catch((error) => {
      console.error(
        `Background processing failed for question ${createdQuestion.id}:`,
        error,
      );
    });

    // Return the created question with processing status
    return res.status(202).json({
      ...createdQuestion,
      status: "processing",
      message: "Question is being processed",
    });
  } catch (error) {
    next(error);
  }
};
