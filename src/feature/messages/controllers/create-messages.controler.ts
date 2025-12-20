import { Request, Response, NextFunction } from "express";
import { sendMessage } from "../operations/messages.create";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { MessageSerializer } from "../messages.config";
import { llmClientProvider, llmProviderManager } from "@/lib/llm";
import { getChatById } from "../../chats/operations/chat.find";
import { User } from "@/feature/users/users.schema";
import { UserRoles } from "@/feature/users/users.types";

export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId, content, userId, metadata } = req.body;
    const user = req.user as User;
    const senderType = user.role === UserRoles.USER ? "user" : "assistant";

    const userMessage = await sendMessage({
      chatId,
      content,
      senderType,
      userId,
    });
    const client = llmProviderManager.getClient();
    const result = await client.generateTextContent(content);

    // const previousMessages = await getChatById(chatId);
    // console.log(previousMessages);
    const aiMessage = await sendMessage({
      chatId,
      content: result.content,
      senderType,
      userId: user.id,
    });

    sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...userMessage,
          id: userMessage.id.toString(),
        } as typeof userMessage & {
          id: string;
        },
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
