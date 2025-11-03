import { Router } from "express";
import { registerUserController } from "./controllers/register.controller";
import { loginUserController } from "./controllers/login.controller";
import { validate } from "../middleware/request-validators";
import { loginUserSchema, registerUserSchema } from "./auth.schema";

const authRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The user's unique ID
 *         name:
 *           type: string
 *           nullable: true
 *           description: The user's full name
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: The user's email address
 *         role:
 *           type: string
 *           enum: [user, admin, lawyer]
 *           default: user
 *         isActive:
 *           type: boolean
 *           default: true
 *         isAnonymous:
 *           type: boolean
 *           default: false
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Must contain at least one uppercase, one lowercase, one number
 *           example: "SecurePass123"
 *         name:
 *           type: string
 *           minLength: 2
 *           description: User's full name
 *           example: "John Doe"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: "SecurePass123"
 *
 *     AuthSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               description: JWT access token
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Human-readable error message
 *             code:
 *               type: string
 *               description: Error code for programmatic handling
 *               example: "USER_EXISTS"
 */

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided credentials
 *     tags: [Authentication v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: JWT token in HTTP-only cookie
 *       400:
 *         description: Bad request (e.g., invalid email format, weak password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /v1/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Authenticates a user with email and password
 *     tags: [Authentication v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: JWT token in HTTP-only cookie
 *       400:
 *         description: Invalid request (missing fields, wrong format)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

authRouter.post(
  "/register",
  validate(registerUserSchema),
  registerUserController,
);
authRouter.post("/login", validate(loginUserSchema), loginUserController);

export default authRouter;

export const AUTH_PATH = "/v1";
