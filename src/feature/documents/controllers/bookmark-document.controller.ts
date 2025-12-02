import { Request, Response, NextFunction } from "express";
import { bookmarkDocument } from "../operations/documents.update";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { HttpStatus } from "@/lib/express/http-status";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";

export const bookmarkDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const metadata: ControllerMetadata = {
    route: req.path,
    name: "bookmarkDocumentController",
    operation: req.method === "POST" ? "create" : "delete",
    resourceType: "document",
    requestId: req.requestId,
  };
  try {
    const documentId = Number(req.params.id);
    const userId = req.user?.id;

    const document = await bookmarkDocument({
      documentId,
      user_id: userId!,
    });

    res.on("finish", async () => {
      await documentsQueue.enqueue(DocumentsJobType.DocumentBookmarked, {
        ...document,
      });
    });

    sendSuccessResponse(
      res,
      {
        ...document,
      },
      {
        ...metadata,
        timestamp: new Date().toISOString(),
        resourceId: document.id,
        status: HttpStatus.CREATED,
      },
    );
  } catch (error) {
    next(error);
  }
};
