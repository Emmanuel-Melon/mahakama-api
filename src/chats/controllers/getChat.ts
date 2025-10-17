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
    const userId = req.user?.id || req.fingerprint?.hash;

    if (!userId) {
      throw new ApiError("User not authenticated", 401);
    }

    const chat = await getChat(chatId, userId);

    if (!chat) {
      throw new ApiError("Chat not found", 404, "CHAT_NOT_FOUND");
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
