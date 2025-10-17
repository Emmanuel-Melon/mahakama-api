import { Request, Response, NextFunction } from "express";
import { sendMessage } from "../operations/sendMessage";
import { createBaseUser } from "../chat.types";
import { createQuestion } from "../../questions/operations/create";
import { processQuestion } from "../../questions/operations/process";

export const sendMessageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("sending message handler");
    if (!req.fingerprint?.hash) {
      return res.status(400).json({
        status: "error",
        message: "Could not identify user session",
        code: "MISSING_FINGERPRINT",
      });
    }

    const { chatId } = req.params;
    const { content, questionId, metadata } = req.body;

    // Create sender info from fingerprint
    const sender = createBaseUser(req.fingerprint.hash, "user");

    try {
      // First, send the message
      const message = await sendMessage({
        chatId,
        content,
        sender,
        questionId,
        metadata,
      });

      console.log("sender", sender);

      // If this is a user message, create and process a question
      if (sender.type === "user") {
        try {
          // First create the question in the database
          const question = await createQuestion({
            chatId,
            question: content,
            status: "pending",
            userFingerprint: sender.id,
            relatedDocuments: [],
            relevantLaws: [],
            country: "South Sudan",
            provider: "gemini",
          });

          // Process the question in the background
          const processedQuestionResult = await processQuestion(
            question.question,
            question.id,
            chatId,
          ).catch((error) => {
            console.error(`Failed to process question ${question.id}:`, error);
          });
          console.log("processedQuestionResult", processedQuestionResult);
        } catch (error) {
          console.error("Error creating question:", error);
          // Don't fail the message send if question processing fails
        }
      }

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
          code: "CHAT_NOT_FOUND",
        });
      }
      throw error; // Let the error handling middleware handle other errors
    }
  } catch (error) {
    next(error);
  }
};
