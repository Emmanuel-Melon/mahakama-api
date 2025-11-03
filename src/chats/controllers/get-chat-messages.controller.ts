import { Request, Response, NextFunction } from "express";
import { getChatMessages } from "../operations/chats.list";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/response";
import { type ControllerMetadata } from "../../lib/express/types";
import { HttpStatus } from "../../lib/express/http-status";

export const getChatMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getChatMessagesController",
      resourceType: "chats",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const { chatId } = req.params;
    const messages = await getChatMessages(chatId);

    sendSuccessResponse(res, { messages }, {
      ...metadata,
      timestamp: new Date().toISOString(),
      status: HttpStatus.SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};
