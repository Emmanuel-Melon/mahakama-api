import { Request, Response } from "express";
import { findDocumentById } from "../operations/document.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getDocumentByIdControlle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const document = await findDocumentById(id);
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
});
