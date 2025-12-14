import { Request, Response, NextFunction } from "express";
import { listDocuments } from "../operations/documents.list";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";

export const getDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getDocumentsController",
      resourceType: "document",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const { type, limit, offset } = req.query;

    const documents = await listDocuments({
      type: type as string | undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    sendSuccessResponse(
      req,
      res,
      {
        data: documents.data.map(document => ({ ...document, id: document.id.toString() })) as (typeof documents.data[number] & { id: string })[],
        type: "collection",
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
