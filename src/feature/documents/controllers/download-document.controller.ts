import { Request, Response } from "express";
import { downloadDocument } from "../operations/documents.update";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { findDocumentById } from "../operations/document.find";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { parsePdfFromUrl } from "@/lib/pdf-parse/index";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const downloadDocumentController = asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.validatedParams;
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

  sendSuccessResponse(
    req,
    res,
    {
      data: { ...document, id: document.id.toString() } as typeof document & {
        id: string;
      },
      type: "single",
      serializerConfig: DocumentsSerializer,
    },
    {
      status: HttpStatus.SUCCESS,
    },
  );

  res.on("finish", async () => {
    parsePdfFromUrl(document.storageUrl);
    await documentsQueue.enqueue(DocumentsJobType.DocumentDownloaded, {
      ...document,
    });
  });
});
