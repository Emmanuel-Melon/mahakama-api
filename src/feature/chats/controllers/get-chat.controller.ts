import { Request, Response, NextFunction } from "express";
import { getChat } from "../operations/chat.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/http-status";
import { ChatSerializer } from "../chats.config";

export const getChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getChatController",
      resourceType: "chat",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const { chatId } = req.params;
    const userId = req.user?.id!;
    const chat = await getChat(chatId, userId);
    if (!chat) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
      });
    }
    sendSuccessResponse(
      req,
      res,
      {
        data: { ...chat.chat, id: chat.chat.id.toString() } as typeof chat.chat & { id: string },
        type: "single",
        serializerConfig: ChatSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    next(error);
  }
};
