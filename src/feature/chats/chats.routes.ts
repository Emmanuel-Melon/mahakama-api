import { Router } from "express";
import { createChatController } from "./controllers/create-chat.controller";
import { getUserChatsController } from "./controllers/get-user-chats.controller";
import { getChatController } from "./controllers/get-chat.controller";
import { getMessagesByChatIdController } from "./controllers/get-chat-messages.controller";

export const CHATS_PATH = "/v1/chats";

const chatRouter = Router();

chatRouter.post("/", createChatController);
chatRouter.get("/", getUserChatsController);
chatRouter.get("/:chatId", getChatController);
chatRouter.get("/:chatId/messages", getMessagesByChatIdController);

export default chatRouter;
