import { Request, Response, NextFunction } from "express";
import { sendMessage } from "../operations/messages.create";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { MessageSerializer } from "../messages.config";

export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId, content, sender, metadata } = req.body;
    
    const message = await sendMessage({
      chatId,
      content,
      sender,
      metadata,
    });

    sendSuccessResponse(
      req,
      res,
      {
        data: { ...message, id: message.id.toString() } as typeof message & { id: string },
        type: "single",
        serializerConfig: MessageSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  } catch (error) {
    next(error);
  }
};
