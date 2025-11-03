import { Request, Response, NextFunction } from "express";
import { listDocuments } from "../operations/documents.list";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/response";
import { type ControllerMetadata } from "../../lib/express/types";
import { HttpStatus } from "../../lib/express/http-status";

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

    sendSuccessResponse(res, { documents: documents.data }, {
      ...metadata,
      timestamp: new Date().toISOString(),
      status: HttpStatus.SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};
