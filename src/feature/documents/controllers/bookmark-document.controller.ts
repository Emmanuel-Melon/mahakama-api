import { Request, Response } from "express";
import { bookmarkDocument } from "../operations/documents.update";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { HttpStatus } from "@/http-status";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const bookmarkDocumentController = asyncHandler(async (req: Request, res: Response) => {
  const metadata: ControllerMetadata = {
    route: req.path,
    name: "bookmarkDocumentController",
    operation: req.method === "POST" ? "create" : "delete",
    resourceType: "document",
    requestId: req.requestId,
  };
  const documentId = Number(req.params.id);
  const userId = req.user?.id;

  const document = await bookmarkDocument({
    documentId,
    user_id: userId!,
  });

  // res.on("finish", async () => {
  //   await documentsQueue.enqueue(DocumentsJobType.DocumentBookmarked, {
  //     ...document,
  //   });
  // });

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
