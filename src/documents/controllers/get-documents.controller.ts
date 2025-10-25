import { Request, Response, NextFunction } from "express";
import { listDocuments } from "../operations/document.list";

export const getDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { type, limit, offset } = req.query;

    const result = await listDocuments({
      type: type as string | undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        limit: limit ? Number(limit) : 10,
        offset: offset ? Number(offset) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
