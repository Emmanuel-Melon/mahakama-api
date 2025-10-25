import { Request, Response, NextFunction } from "express";
import { findDocumentById } from "../operations/document.find";

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const document = await findDocumentById(Number(id));

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};
