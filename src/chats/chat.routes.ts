import { Router } from "express";
import { chatIdSchema, sendMessageSchema } from "./chat.schema";
import { createChatHandler } from "./controllers/createChat";
import { getUserChatsHandler } from "./controllers/getUserChats";
import { getChatHandler } from "./controllers/getChat";
import { sendMessageHandler } from "./controllers/sendMessage";
import { getChatMessagesHandler } from "./controllers/getChatMessages";

export const BASE_PATH = "/chats";

const chatRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Chats v1
 *     description: Chat management endpoints
 *
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the chat
 *         title:
 *           type: string
 *           description: Title of the chat
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who owns the chat
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         chatId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [user, assistant, system]
 *         content:
 *           type: string
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateChatRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "Legal Consultation about Property"
 *
 *     SendMessageRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 10000
 *           example: "What are my rights as a tenant?"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: false
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             code:
 *               type: string
 *               nullable: true
 */

/**
 * @swagger
 * /v1/chats:
 *   post:
 *     summary: Create a new chat
 *     description: Creates a new chat session
 *     tags: [Chats v1]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChatRequest'
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
chatRouter.post("/", createChatHandler);

/**
 * @swagger
 * /v1/chats:
 *   get:
 *     summary: Get user's chats
 *     description: Returns a list of chats for the authenticated user
 *     tags: [Chats v1]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
chatRouter.get("/", getUserChatsHandler);

/**
 * @swagger
 * /v1/chats/{chatId}:
 *   get:
 *     summary: Get chat by ID
 *     description: Returns a specific chat by its ID
 *     tags: [Chats v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the chat to retrieve
 *     responses:
 *       200:
 *         description: Chat details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       404:
 *         description: Chat not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
chatRouter.get("/:chatId", getChatHandler);

/**
 * @swagger
 * /v1/chats/{chatId}/messages:
 *   post:
 *     summary: Send a message
 *     description: Send a new message to a chat
 *     tags: [Chats v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the chat to send message to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageRequest'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input or chat not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
chatRouter.post("/:chatId/messages", sendMessageHandler);

/**
 * @swagger
 * /v1/chats/{chatId}/messages:
 *   get:
 *     summary: Get chat messages
 *     description: Retrieve messages for a specific chat
 *     tags: [Chats v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the chat to get messages from
 *     responses:
 *       200:
 *         description: List of messages in the chat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       404:
 *         description: Chat not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
chatRouter.get("/:chatId/messages", getChatMessagesHandler);

export default chatRouter;
