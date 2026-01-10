import { Request, Response } from "express";
import { getChatById } from "../operations/chat.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/http-status";
import { ChatSerializer } from "../chats.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getChatController = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const userId = req.user?.id!;
  const chat = await getChatById(chatId);
  if (!chat) {
    return sendErrorResponse(req, res, {
      status: HttpStatus.NOT_FOUND,
    });
  }
  sendSuccessResponse(
    req,
    res,
    {
      data: {
        ...chat,
        id: chat.id.toString(),
      } as typeof chat & { id: string },
      type: "single",
      serializerConfig: ChatSerializer,
    },
    {
      status: HttpStatus.SUCCESS,
    },
  );
});
