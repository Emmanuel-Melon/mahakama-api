import { Request, Response, NextFunction } from "express";
import { getUserChats } from "../operations/chats.find";
import { sendSuccessResponse } from "../../lib/express/response";
import { type ControllerMetadata } from "../../lib/express/types";
import { HttpStatus } from "../../lib/express/http-status";

export const getUserChatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getUserChatsController",
      resourceType: "chats",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const chats = await getUserChats(req.user?.id!);
    sendSuccessResponse(res, { chats }, {
      ...metadata,
      timestamp: new Date().toISOString(),
      status: HttpStatus.SUCCESS,
    });
  } catch (error: any) {
    next(error);
  }
};
