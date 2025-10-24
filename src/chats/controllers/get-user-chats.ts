import { Request, Response, NextFunction } from "express";
import { getUserChats } from "../operations/get-user-chats";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export const getUserChatsController = async (
  req: Request,
  res: Response<ApiResponse<any[]>>,
  next: NextFunction,
) => {
  try {
    const chats = await getUserChats(req.user?.id!);
    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error: any) {
    next(error);
  }
};
