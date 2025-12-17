import { Request, Response, NextFunction } from "express";
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
  } catch (error) {
    next(error);
  }
};
