import { Request, Response, NextFunction } from "express";
import { sendMessage } from "../operations/message.send";
import { createUser } from "../../users/operations/users.create";
import { findById, findByFingerprint } from "../../users/operations/users.find";
import { v4 as uuid } from "uuid";

export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.fingerprint?.hash) {
      return res.status(400).json({
        success: false,
        data: "Could not identify user session",
      });
    }
    const { chatId } = req.params;
    const { content, questionId, metadata } = req.validatedData;
    const userId = req.user?.id || req.fingerprint?.hash;

    const [userById, userByFingerprint] = await Promise.all([
      findById(userId),
      findByFingerprint(req.fingerprint.hash),
    ]);

    if (!userById && !userByFingerprint) {
      return res.status(409).json({
        success: false,
        data: "User not found",
      });
    }

    if (
      userById ||
      (userByFingerprint && userById?.id === userByFingerprint?.id)
    ) {
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

    const sender = await createUser({
      id: uuid(),
      name: "User",
      email: "user@example.com",
      fingerprint: req.fingerprint?.hash,
      userAgent: req.headers["user-agent"],
    });

    const message = await sendMessage({
      chatId,
      content,
      sender,
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
