import { Request, Response, NextFunction } from "express";
import { listQuestions } from "../operations/list";

export const getQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { limit, offset } = req.query;
    const result = await listQuestions({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      metadata: {
        total: result.total,
        limit: limit ? Number(limit) : 10,
        offset: offset ? Number(offset) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    next(error);
  }
};
