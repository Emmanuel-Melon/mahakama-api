import { Request, Response, NextFunction } from "express";
import { getUserChats } from "../operations/getUserChats";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export const getUserChatsHandler = async (
  req: Request,
  res: Response<ApiResponse<any[]>>,
  next: NextFunction,
) => {
  try {
    if (!req.fingerprint?.hash) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            "Could not identify user session. Please ensure cookies are enabled.",
          code: "MISSING_FINGERPRINT",
        },
      });
    }

    const fingerprint = req.fingerprint.hash;
    const chats = await getUserChats(fingerprint);

    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error: any) {
    if (error.message === "Failed to fetch user chats") {
      return res.status(403).json({
        success: false,
        error: {
          message: "You don't have permission to access these chats",
          code: "FORBIDDEN",
        },
      });
    }

    // For unhandled errors, pass to the error handling middleware
    next(error);
  }
};
