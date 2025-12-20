import { Request, Response, NextFunction } from "express";
import { createChat } from "../operations/chats.create";
import { User } from "@/feature/users/users.schema";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { ChatSerializer } from "../chats.config";
import { llmClientProvider, llmProviderManager } from "@/lib/llm";
import { sendMessage } from "@/feature/messages/operations/messages.create";
import { UserRoles } from "@/feature/users/users.types";

export const createChatController = async (
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message, metadata: bodyMetadata } = req.body;
    const user = req.user as User;
    const senderType = user.role === UserRoles.USER ? "user" : "assistant";
    const chat = await createChat({
      userId: user.id,
      title: message,
      metadata: bodyMetadata,
    });
    sendMessage({
      chatId: chat?.id!,
      content: message,
      senderType,
      userId: user.id,
    });
    const client = llmProviderManager.getClient();
    const result = await client.generateTextContent(message);
    sendMessage({
      chatId: chat?.id!,
      content: result.content,
      senderType,
      userId: user.id,
    });
    if (chat) {
      return sendSuccessResponse(
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
          status: HttpStatus.CREATED,
        },
      );
    }
    sendErrorResponse(req, res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    next(error);
  }
};
