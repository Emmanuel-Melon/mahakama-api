import { Request, Response } from "express";
import { findDocumentById } from "../operations/find";

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await findDocumentById(Number(id));

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({
      error: "Failed to fetch document",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
