import { Router } from "express";
import { registerUserController } from "./controllers/register.controller";
import { loginUserController } from "./controllers/login.controller";
import { validate } from "../middleware/request-validators";
import { loginUserSchema, registerUserSchema } from "./auth.schema";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication v1
 *     description: Authentication endpoints (v1)
 *
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT access token
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
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user (v1)
 *     description: |
 *       Creates a new user account and returns an authentication token.
 *
 *       **Note:** Password must be at least 8 characters long.
 *     tags: [Authentication v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *                 minLength: 2
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request (e.g., invalid input, user already exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/register", validate(registerUserSchema), registerUserController);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Authenticate a user (v1)
 *     description: |
 *       Authenticates a user and returns a JWT token for accessing protected routes.
 *
 *       **Note:** The token should be included in the `Authorization` header for subsequent requests.
 *     tags: [Authentication v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/login", validate(loginUserSchema), loginUserController);

export default authRouter;

export const AUTH_PATH = "/v1";