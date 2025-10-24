import { Request, Response, NextFunction } from "express";
import { createChat } from "../operations/chat.create";
import { ChatSessionAttrs } from "../chat.schema";
import { queryProcessor } from "../../rag-pipeline/query/processor";
import { User } from "../../users/user.schema";

export const createChatController = async (
  req: Request<{}, {}, ChatSessionAttrs>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { initialMessage } = req.validatedData;
    const { embeddings } = await queryProcessor(initialMessage);
    const chat = await createChat(
      {
        message: initialMessage,
      },
      req.user as User,
    );

    res.status(201).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};
