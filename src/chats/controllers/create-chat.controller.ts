import { Request, Response, NextFunction } from "express";
import { createChat } from "../operations/chats.create";
import { ChatSessionAttrs, ChatSession } from "../chats.schema";
import { queryProcessor } from "../../query/query.processor";
import { User } from "../../users/users.schema";
import {
  findRelevantLaws,
  getMostRelevantLaw,
} from "../../rag-pipeline/knowledge/vectorizer";
import {
  generateTitleFromMessage,
  chat,
} from "../../lib/llm/ollama/ollama.chat";
import {
  toOllamaMessage,
  fromOllamaMessage,
  createSystemPrompt,
  createChatSessionPayload,
} from "../../lib/llm/ollama/chat-utils";
import { SenderType } from "../chats.types";
import { sendSuccessResponse } from "../../lib/express/response";
import { type ControllerMetadata } from "../../lib/express/types";
import { HttpStatus } from "../../lib/express/http-status";

export const createChatController = async (
  req: Request<{}, {}, ChatSessionAttrs>,
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
    const initialMessage = req.body.message!;
    const userId = (req.user as User).id;

    // Process the query and find relevant laws
    const processedQuery = await queryProcessor(initialMessage);
    const relevantLaws = await findRelevantLaws(processedQuery);
    const mostRelevantLaw = getMostRelevantLaw(relevantLaws);

    // Generate a title for the chat
    const title = await generateTitleFromMessage(initialMessage);

    // Create chat session payload
    const chatSessionData = createChatSessionPayload(
      title,
      initialMessage,
      relevantLaws,
      userId,
    );

    // Create the chat session
    const createdChat = (await createChat(
      {
        message: initialMessage,
        metadata: chatSessionData.metadata,
      },
      req.user as User,
    )) as ChatSession;

    // Prepare messages for the LLM
    const systemPrompt = createSystemPrompt(initialMessage, mostRelevantLaw);
    const userMessage = toOllamaMessage(initialMessage, SenderType.USER);

    // Get the AI's response
    // const response = await chat([systemPrompt, userMessage], DEFAULT_MODEL);

    //console.log("Response: ", response);

    // Save the conversation to the database
    // await db.insert(chatMessages).values([
    //   {
    //     chatId: createdChat.id,
    //     content: initialMessage,
    //     senderId: userId,
    //     senderType: SenderType.USER,
    //     metadata: { processedQuery },
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    //   {
    //     chatId: createdChat.id,
    //     content: response.message.content,
    //     senderId: 'system', // or your AI user ID
    //     senderType: SenderType.ASSISTANT,
    //     metadata: { relevantLaws },
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   }
    // ]);

    sendSuccessResponse(res, { createdChat }, {
      ...metadata,
      timestamp: new Date().toISOString(),
      status: HttpStatus.SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};
