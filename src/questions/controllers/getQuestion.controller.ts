import { Request, Response } from "express";
import { findQuestionById } from "../operations/find";

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await findQuestionById(Number(id));

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({
      error: "Failed to fetch question",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
