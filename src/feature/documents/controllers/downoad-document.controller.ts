import { Request, Response, NextFunction } from "express";
import { downloadDocument } from "../operations/documents.update";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { findDocumentById } from "../operations/document.find";
import { HttpStatus } from "@/lib/express/http-status";

export const downloadDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const metadata: ControllerMetadata = {
    name: "downloadDocumentController",
    resourceType: "document",
    route: req.path,
    operation: "download",
    requestId: req.requestId,
  };
  try {
    const documentId = Number(req.params.id);
    const userId = req.user?.id;

    await downloadDocument({
      documentId,
      user_id: userId!,
    });

    res.on("finish", async () => {
      // const document = await findDocumentById(documentId);
      // await documentsQueue.enqueue(DocumentsJobType.DocumentDownloaded, {
      //   ...document,
      // });
    });

    sendSuccessResponse(
      res,
      { ...document },
      {
        ...metadata,
        timestamp: new Date().toISOString(),
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    next(error);
  }
};
