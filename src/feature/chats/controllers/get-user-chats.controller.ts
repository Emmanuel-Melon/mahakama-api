import { Request, Response } from "express";
import { getUserChats } from "../operations/chats.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { ChatSerializer } from "../chats.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getUserChatsController = asyncHandler(async (req: Request, res: Response) => {
  const chats = await getUserChats(req.user?.id!);
  sendSuccessResponse(
    req,
    res,
    {
      data: chats.map((chat) => ({
        ...chat,
        id: chat.id.toString(),
      })) as ((typeof chats)[number] & { id: string })[],
      type: "collection",
      serializerConfig: ChatSerializer,
    },
    {
      status: HttpStatus.SUCCESS,
    },
  );
});
