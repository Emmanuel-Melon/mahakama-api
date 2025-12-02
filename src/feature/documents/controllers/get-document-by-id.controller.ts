import { Request, Response, NextFunction } from "express";
import { findDocumentById } from "../operations/document.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/lib/express/http-status";

export const getDocumentByIdControlle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "createDocumentController",
      resourceType: "document",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const { id } = req.params;
    const document = await findDocumentById(Number(id));

    if (!document) {
      return sendErrorResponse(res, HttpStatus.NOT_FOUND);
    }

    sendSuccessResponse(
      res,
      { ...document },
      {
        ...metadata,
        timestamp: new Date().toISOString(),
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    next(error);
  }
};
