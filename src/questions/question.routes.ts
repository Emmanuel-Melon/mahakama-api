import { Router } from "express";
import { getQuestion } from "./controllers/getQuestion.controller";
import { getQuestions } from "./controllers/getQuestions.controller";
import { createQuestionHandler } from "./controllers/createQuestion.controller";
import { processQuestionById } from "./controllers/processQuestionById.controller";

const questionRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Questions v1
 *     description: Legal question management endpoints
 *
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the question
 *         content:
 *           type: string
 *           description: The actual question text
 *         category:
 *           type: string
 *           description: Legal category of the question
 *           example: "Family Law"
 *         status:
 *           type: string
 *           enum: [pending, processing, answered, closed]
 *           default: "pending"
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who asked the question
 *         lawyerId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the lawyer assigned to answer
 *         answer:
 *           type: string
 *           nullable: true
 *           description: The provided answer to the question
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           description: Additional metadata about the question
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateQuestionRequest:
 *       type: object
 *       required:
 *         - content
 *         - category
 *       properties:
 *         content:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           example: "What are my rights if my landlord wants to evict me?"
 *         category:
 *           type: string
 *           example: "Housing Law"
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           example: {"urgency": "high", "relatedCaseNumber": "CASE123"}
 *
 *     ProcessQuestionRequest:
 *       type: object
 *       required:
 *         - lawyerId
 *       properties:
 *         lawyerId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           default: "medium"
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
 * /v1/questions:
 *   post:
 *     summary: Create a new legal question
 *     description: Submit a new legal question to the system
 *     tags: [Questions v1]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuestionRequest'
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
questionRoutes.post("/v1/questions", createQuestionHandler);

/**
 * @swagger
 * /v1/questions:
 *   get:
 *     summary: Get all questions
 *     description: Retrieve a list of questions with optional filtering
 *     tags: [Questions v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, answered, closed]
 *         description: Filter questions by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter questions by legal category
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter questions by user ID
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
questionRoutes.get("/v1/questions", getQuestions);

/**
 * @swagger
 * /v1/questions/{id}:
 *   get:
 *     summary: Get a specific question
 *     description: Retrieve details of a specific question by its ID
 *     tags: [Questions v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Question's unique identifier
 *     responses:
 *       200:
 *         description: Question details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
questionRoutes.get("/v1/questions/:id", getQuestion);

/**
 * @swagger
 * /v1/questions/{id}/process:
 *   post:
 *     summary: Process a question
 *     description: Assign a lawyer to process and answer a question
 *     tags: [Questions v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Question's unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessQuestionRequest'
 *     responses:
 *       200:
 *         description: Question processing started
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Invalid input or question cannot be processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
questionRoutes.post("/v1/questions/:id/process", processQuestionById);

export default questionRoutes;
