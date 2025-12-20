import { Request, Response, NextFunction } from "express";
import { getMessagesByChatId } from "../operations/messages.list";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { MessageSerializer } from "../messages.config";

export const getMessagesByChatIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId } = req.params;

    const messages = await getMessagesByChatId(chatId);

    sendSuccessResponse(
      req,
      res,
      {
        data: messages.map((message) => ({
          ...message,
          id: message.id.toString(),
        })),
        type: "collection",
        serializerConfig: MessageSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    next(error);
  }
};
