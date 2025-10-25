import { Request, Response, NextFunction } from "express";
import { bookmarkDocument } from "../operations/document.update";

const HANDLER_NAME = "bookmarkDocumentHandler";
const RESOURCE_TYPE = "documentBookmark";

export const bookmarkDocumentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const metadata = {
    route: req.path,
    handler: HANDLER_NAME,
    operation: req.method === "POST" ? "create" : "delete",
    resourceType: RESOURCE_TYPE,
  };

  try {
    const documentId = Number(req.params.id);
    const userId = req.user?.id;

    const result = await bookmarkDocument({
      documentId,
      userId: userId!,
    });

    return res.status(200).json({
      success: true,
      data: {
        documentId: result.documentId,
        bookmarked: result.bookmarked,
      },
      metadata: {
        ...metadata,
        resourceId: result.documentId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
