import { Request, Response, NextFunction } from "express";
import { getChat } from "../operations/chat.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/lib/express/http-status";

export const getChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getChatController",
      resourceType: "chats",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const { chatId } = req.params;
    const userId = req.user?.id!;
    const chat = await getChat(chatId, userId);
    if (!chat) {
      return sendErrorResponse(res, HttpStatus.NOT_FOUND);
    }
    sendSuccessResponse(
      res,
      { ...chat },
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
