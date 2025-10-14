import { Request, Response, NextFunction } from "express";
import { sendMessage } from "../operations/sendMessage";
import { createBaseUser } from "../chat.types";

export const sendMessageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("sending message handler")
    if (!req.fingerprint?.hash) {
      return res.status(400).json({
        status: "error",
        message: "Could not identify user session",
        code: "MISSING_FINGERPRINT"
      });
    }

    const { chatId } = req.params;
    const { content, questionId, metadata } = req.body;
    
    // Create sender info from fingerprint
    const sender = createBaseUser(req.fingerprint.hash, "user");

    try {
      const message = await sendMessage({
        chatId,
        content,
        sender,
        questionId,
        metadata,
      });

      return res.status(201).json({
        status: "success",
        data: {
          message,
        },
      });
    } catch (error: any) {
      if (error.message === "Chat not found") {
        return res.status(404).json({
          status: "error",
          message: "Chat not found or you don't have permission to access it",
          code: "CHAT_NOT_FOUND"
        });
      }
      throw error; // Let the error handling middleware handle other errors
    }
  } catch (error) {
    next(error);
  }
};
