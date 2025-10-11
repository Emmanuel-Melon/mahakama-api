import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../middleware/errors";
import { createQuestion } from "../operations/create";
import { processQuestion as processQuestionOperation } from "../operations/process";

export const processQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, country = "South Sudan" } = req.body;

    if (!question) {
      throw new ApiError("Question is required", 400, "MISSING_QUESTION");
    }

    const createdQuestion = await createQuestion({
      question,
      status: "pending",
      answer: "",
      relatedDocuments: [],
      relevantLaws: [],
      country,
      provider: "gemini",
    });

    // Process the question in the background
    processQuestionOperation(question, createdQuestion.id)
      .catch(error => {
        console.error(`Background processing failed for question ${createdQuestion.id}:`, error);
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

