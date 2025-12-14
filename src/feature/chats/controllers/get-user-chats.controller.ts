import { Request, Response, NextFunction } from "express";
import { getUserChats } from "../operations/chats.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/http-status";
import { ChatSerializer } from "../chats.config";

export const getUserChatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "getUserChatsController",
      resourceType: "chat",
      route: req.path,
      operation: "fetch",
      requestId: req.requestId,
    };
    const chats = await getUserChats(req.user?.id!);
    sendSuccessResponse(
      req,
      res,
      {
        data: chats.map(chat => ({ ...chat, id: chat.id.toString() })) as (typeof chats[number] & { id: string })[],
        type: "collection",
        serializerConfig: ChatSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error: any) {
    next(error);
  }
};
