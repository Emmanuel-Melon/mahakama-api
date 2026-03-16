import { Request, Response } from "express";
import { bookmarkDocument } from "../operations/documents.update";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";

export const bookmarkDocumentController = asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.validatedParams;
  const userId = req.user?.id;

  const document = await bookmarkDocument({
    documentId,
    user_id: userId!,
  });

  if (!document) {
    return sendErrorResponse(req, res, {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      description: "Unable to bookmark document at the moment. Please try again later."
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
      status: HttpStatus.CREATED,
    },
  );

  res.on("finish", async () => {
    await documentsQueue.enqueue(DocumentsJobType.DocumentBookmarked, {
      ...document,
    });
  });
});
