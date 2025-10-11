import { Request, Response, NextFunction } from "express";
import { findDocumentById } from "../operations/find";

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const document = await findDocumentById(Number(id));

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};
