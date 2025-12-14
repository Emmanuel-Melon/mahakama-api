import { Request, Response, NextFunction } from "express";
import { findDocumentById } from "../operations/document.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";

export const getDocumentByIdControlle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getDocumentByIdController",
      resourceType: "document",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const { id } = req.params;
    const document = await findDocumentById(Number(id));

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
  } catch (error) {
    next(error);
  }
};
