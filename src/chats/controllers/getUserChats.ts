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
        message: "Could not identify user session",
      });
    }

    const fingerprint = req.fingerprint.hash;
    const chats = await getUserChats(fingerprint);

    res.status(200).json({
      status: "success",
      results: chats.length,
      data: {
        chats,
      },
    });
  } catch (error) {
    next(error);
  }
};
