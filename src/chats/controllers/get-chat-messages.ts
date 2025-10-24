import { Request, Response, NextFunction } from "express";
import { getChatMessages } from "../operations/get-chat-messages";

export const getChatMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId } = req.params;
    const messages = await getChatMessages(chatId);

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
