import { Router } from "express";
import { chatIdSchema, sendMessageSchema } from "./chat.schema";
import { createChatHandler } from "./controllers/createChat";
import { getUserChatsHandler } from "./controllers/getUserChats";
import { getChatHandler } from "./controllers/getChat";
import { sendMessageHandler } from "./controllers/sendMessage";
import { getChatMessagesHandler } from "./controllers/getChatMessages";

export const BASE_PATH = "/chats";

const chatRouter = Router();

// Create a new chat
chatRouter.post("/", createChatHandler);

// Get all chats for the current user (identified by fingerprint)
chatRouter.get("/", getUserChatsHandler);

// Get a specific chat
chatRouter.get("/:chatId", getChatHandler);

// Send a message to a chat
chatRouter.post("/:chatId/messages", sendMessageHandler);

// Get messages for a chat
chatRouter.get("/:chatId/messages", getChatMessagesHandler);

export default chatRouter;
