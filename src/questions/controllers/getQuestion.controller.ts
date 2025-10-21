import { Request, Response, NextFunction } from "express";
import { findQuestionById } from "../operations/find";

export const getQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const question = await findQuestionById(Number(id));

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    next(error);
  }
};
