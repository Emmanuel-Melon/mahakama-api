import { Request, Response, NextFunction } from "express";
import { createDocument } from "../operations/documents.create";
import { CreateDocumentInput } from "../documents.types";
import { HttpStatus } from "@/lib/express/http-status";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";

export const createDocumentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const metadata: ControllerMetadata = {
    name: "createDocumentController",
    resourceType: "document",
    route: req.path,
    operation: "create",
    requestId: req.requestId,
  };

  try {
    const documentData: CreateDocumentInput = req.body;
    // Format and validate URL
    let storageUrl = documentData.storageUrl;
    if (!storageUrl.startsWith("http")) {
      storageUrl = `https://${storageUrl}`;
    }

    const document = await createDocument({
      ...documentData,
      storageUrl,
    });

    // we're gonna have to investigate this! Pushing into queues during or after the request has been processed
    res.on("finish", async () => {
      await documentsQueue.enqueue(DocumentsJobType.DocumentCreated, {
        ...document,
      });
    });

    sendSuccessResponse(
      res,
      { ...document },
      {
        ...metadata,
        timestamp: new Date().toISOString(),
        status: HttpStatus.CREATED,
      },
    );
  } catch (error) {
    next(error);
  }
};
