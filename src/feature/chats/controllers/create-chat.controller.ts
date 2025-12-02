import { Request, Response, NextFunction } from "express";
import { createChat } from "../operations/chats.create";
import { queryProcessor } from "@/feature/rag-pipeline/query/query.processor";
import { User } from "@/feature/users/users.schema";
import {
  findRelevantLaws,
  getMostRelevantLaw,
} from "../../rag-pipeline/knowledge/vectorizer";
import {
  createSystemPrompt,
  createChatSessionPayload,
} from "@/lib/llm/ollama/chat-utils";
import { sendErrorResponse, sendSuccessResponse } from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { HttpStatus } from "@/lib/express/http-status";
import { getChatById } from "../operations/chat.find";
import { eq } from "drizzle-orm";

export const createChatController = async (
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const metadata: ControllerMetadata = {
      name: "createChatController",
      resourceType: "chat",
      route: req.path,
      operation: "create",
      requestId: req.requestId,
    };
    const { message, metadata: bodyMetadata } = req.body;
    const user = req.user as User;

    // Create a new chat session
    const chat = await createChat({
      userId: user.id,
      title: message, // Use the first message as the title
      metadata: bodyMetadata,
    });

    // If there's an initial message, process it
    if (message) {
      // Process the query and get relevant laws
      // const query = await queryProcessor.processQuery(message);
      // const relevantLaws = await findRelevantLaws(query);
      // const mostRelevantLaw = getMostRelevantLaw(relevantLaws, query);

      // Send the user's message
      // await sendMessage({
      //   chatId: chat.id,
      //   content: message,
      //   sender: {
      //     id: user.id,
      //     type: "user",
      //     displayName: user.name || "User",
      //   },
      //   metadata: { query, relevantLaws },
      // });

      // // Send the initial message to the LLM
      // const response = await chat(
      //   createChatSessionPayload([
      //     {
      //       role: "system",
      //       content: createSystemPrompt(mostRelevantLaw, query),
      //     },
      //     {
      //       role: "user",
      //       content: message,
      //     },
      //   ]),
      // );

      // Send the AI's response as the first message
      // await sendMessage({
      //   chatId: chat.id,
      //   content: response.message.content,
      //   sender: {
      //     id: "system",
      //     type: "assistant",
      //     displayName: "Assistant",
      //   },
      //   metadata: { relevantLaw: mostRelevantLaw },
      // });
    }

    // Send the response with the chat and messages
    if (chat) {
      const createdChat = await getChatById(chat.id);

      return sendSuccessResponse(res, {
        data: createdChat,
        message: "Chat created successfully",
        status: HttpStatus.CREATED,
      });
    }
    sendErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
  } catch (error) {
    console.error("Error creating chat:", error);
    next(error);
  }
};
