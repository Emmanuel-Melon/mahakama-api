import { Request, Response, NextFunction } from "express";
import { getChat } from "../operations/getChat";
import { ApiError } from "../../middleware/errors";

export const getChatHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId } = req.params;
    const chat = await getChat(chatId);

    if (!chat) {
      throw new ApiError("Chat not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        chat,
      },
    });
  } catch (error) {
    next(error);
  }
};
