import { Request, Response, NextFunction } from "express";
import { getUserChats } from "../operations/getUserChats";

export const getUserChatsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.fingerprint?.hash) {
      return res.status(400).json({
        status: "error",
        message: "Could not identify user session. Please ensure cookies are enabled.",
        code: "MISSING_FINGERPRINT"
      });
    }

    const fingerprint = req.fingerprint.hash;
    
    try {
      const chats = await getUserChats(fingerprint);
      
      return res.status(200).json({
        status: "success",
        results: chats.length,
        data: {
          chats,
        },
      });
    } catch (error: any) {
      if (error.message === "Failed to fetch user chats") {
        return res.status(403).json({
          status: "error",
          message: "You don't have permission to access these chats",
          code: "FORBIDDEN"
        });
      }
      throw error; // Let the error handling middleware handle other errors
    }
  } catch (error) {
    next(error);
  }
};
