import { Request, Response, NextFunction } from "express";
import { createQuestion } from "../operations/create";
import { processQuestion } from "../operations/process";
import { CreateQuestionInput } from "../question.types";
import { ApiError } from "../../middleware/errors";

// Extend the Express Request type to include fingerprint
declare global {
  namespace Express {
    interface Request {
      fingerprint?: {
        hash: string;
        // ... other fingerprint fields
      };
      user?: {
        id: string;
        // ... other user fields
      };
    }
  }
}

export const createQuestionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { question, country = "South Sudan" } = req.body;
    
    // Get user ID from auth or use fingerprint for anonymous users
    const userId = req.user?.id;
    const userFingerprint = req.fingerprint?.hash;

    if (!question) {
      throw new ApiError(
        "Question is required",
        400,
        "MISSING_QUESTION"
      );
    }

    // Create a new question with 'pending' status
    const questionData: CreateQuestionInput = {
      question,
      status: "pending",
      country,
      provider: "gemini", // Default provider
      answer: "", // Will be populated during processing
      relatedDocuments: [], // Will be populated during processing
      relevantLaws: [], // Will be populated during processing
      // Include user information if available
      ...(userId && { userId }),
      ...(userFingerprint && { userFingerprint })
    };

    const createdQuestion = await createQuestion(questionData);
    
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
