import { Request, Response } from "express";
import { getMessagesByChatId } from "../operations/messages.list";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { MessageSerializer } from "../messages.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getMessagesByChatIdController = asyncHandler(async (req: Request, res: Response) => {
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
});
