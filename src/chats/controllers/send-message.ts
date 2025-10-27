import { Request, Response, NextFunction } from "express";
import { sendMessage } from "../operations/message.send";
import { findById } from "../../users/operations/users.find";
import { queryProcessor } from "../../query/query.processor";

export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId } = req.params;
    const { content, questionId, metadata } = req.validatedData;
    const userId = req.user?.id || req.fingerprint?.hash;
    const processedQuery = await queryProcessor(content);

    const userById = await findById(userId);

    if (userById) {
      const message = await sendMessage({
        chatId,
        content,
        sender: userById,
        questionId,
        metadata,
      });

      return res.status(201).json({
        success: true,
        data: message,
      });
    }

    const message = await sendMessage({
      chatId,
      content,
      sender: userById,
      questionId,
      metadata,
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
