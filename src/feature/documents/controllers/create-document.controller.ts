import { Request, Response } from "express";
import { createDocument } from "../operations/documents.create";
import { NewDocument } from "../documents.types";
import { HttpStatus } from "@/http-status";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";

export const createDocumentHandler = asyncHandler(async (req: Request, res: Response) => {
  const documentData: NewDocument = req.validatedBody;
  let storageUrl = documentData.storageUrl;
  if (!storageUrl.startsWith("http")) {
    storageUrl = `https://${storageUrl}`;
  }
  const document = await createDocument({
    ...documentData,
    storageUrl,
  });

  if (!document) {
    return sendErrorResponse(req, res, {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      description: "Unable to create document at the moment. Please try again later."
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
    await documentsQueue.enqueue(DocumentsJobType.DocumentCreated, {
      ...document,
    });
  });
});
