import { Request, Response } from "express";
import { createDocument } from "../operations/documents.create";
import { NewDocument } from "../documents.types";
import { HttpStatus } from "@/http-status";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const createDocumentHandler = asyncHandler(async (req: Request, res: Response) => {
  const metadata: ControllerMetadata = {
    name: "createDocumentController",
    resourceType: "document",
    route: req.path,
    operation: "create",
    requestId: req.requestId,
  };

  const documentData: NewDocument = req.body;
  let storageUrl = documentData.storageUrl;
  if (!storageUrl.startsWith("http")) {
    storageUrl = `https://${storageUrl}`;
  }
  const document = await createDocument({
    ...documentData,
    storageUrl,
  });

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
});
