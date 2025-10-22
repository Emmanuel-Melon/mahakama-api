import { Request, Response, NextFunction } from "express";
import { createChat } from "../operations/createChat";
import { CreateChatInput, createBaseUser } from "../chat.types";

export const createChatHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, initialMessage, metadata } = req.body;

    if (!req.fingerprint?.hash) {
      return res.status(400).json({
        status: "error",
        message: "Could not generate user fingerprint",
      });
    }

    const anonymousUser = createBaseUser(req.fingerprint.hash);

    const chat = await createChat({
      user: anonymousUser,
      title,
      initialMessage,
      metadata: {
        ...metadata,
        fingerprint: req.fingerprint.hash,
        userAgent: req.userAgent,
      },
    });

    res.status(201).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};
