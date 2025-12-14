import { Request, Response, NextFunction } from "express";
import { getMessagesByChatId } from "../operations/messages.list";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/http-status";
import { MessageSerializer } from "../../messages/messages.config";

export const getMessagesByChatIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getMessagesByChatIdController",
      resourceType: "message",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const { chatId } = req.params;
    const messages = await getMessagesByChatId(chatId);
    sendSuccessResponse(
      req,
      res,
      {
        data: messages.map((message) => ({
          ...message,
          id: message.id.toString(),
        })) as ((typeof messages)[number] & { id: string })[],
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
