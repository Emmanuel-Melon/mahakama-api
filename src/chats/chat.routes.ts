import { Router } from 'express';
import { chatIdSchema, sendMessageSchema } from './chat.schema';
import { createChatHandler } from "./controllers/createChat";
import { getUserChatsHandler } from "./controllers/getUserChats";
import { getChatHandler } from "./controllers/getChat";
import { sendMessageHandler } from "./controllers/sendMessage";
import { getChatMessagesHandler } from "./controllers/getChatMessages";

export const BASE_PATH = '/chats';

const chatRouter = Router();

chatRouter.post(
  '/',
  createChatHandler
);

chatRouter.get('/user/:userId', getUserChatsHandler);

chatRouter.get('/:chatId', getChatHandler);

chatRouter.post(
  '/:chatId/messages',
  sendMessageHandler
);

chatRouter.get(
  '/:chatId/messages',
  getChatMessagesHandler
);


export default chatRouter;
