import { Request, Response, NextFunction } from "express";
import { getMessagesByChatId } from "../operations/messages.list";
import {
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/lib/express/http-status";

export const getMessagesByChatIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getMessagesByChatIdController",
      resourceType: "chats",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const { chatId } = req.params;
    const messages = await getMessagesByChatId(chatId);
    sendSuccessResponse(
      res,
      { messages },
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
