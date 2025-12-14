import { Request, Response, NextFunction } from "express";
import { downloadDocument } from "../operations/documents.update";
import { sendErrorResponse, sendSuccessResponse } from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { findDocumentById } from "../operations/document.find";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";

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

    const document = await findDocumentById(documentId);
    
    if (!document) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
      });
    }

    res.on("finish", async () => {
      // await documentsQueue.enqueue(DocumentsJobType.DocumentDownloaded, {
      //   ...document,
      // });
    });

    sendSuccessResponse(
      req,
      res,
      {
        data: { ...document, id: document.id.toString() } as typeof document & { id: string },
        type: "single",
        serializerConfig: DocumentsSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    next(error);
  }
};
