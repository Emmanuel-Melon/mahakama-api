import { Router } from "express";
import { validateCreateUser } from "./user.middleware";
import { getUsersController } from "./controllers/get-users.controller";
import { getUserController } from "./controllers/get-user.controller";
import { createUserController } from "./controllers/create-user.controller";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Users v1
 *     description: User management endpoints
 *
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         name:
 *           type: string
 *           description: Full name of the user
 *         role:
 *           type: string
 *           enum: [user, admin, lawyer]
 *           default: "user"
 *           description: User's role in the system
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the user account is active
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Timestamp of last login
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: "securePassword123"
 *         role:
 *           type: string
 *           enum: [user, admin, lawyer]
 *           default: "user"
 *           example: "user"
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
 * /v1/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all registered users (admin only)
 *     tags: [Users v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin, lawyer]
 *         description: Filter users by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get("/", getUsersController);

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details by user ID
 *     tags: [Users v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not authorized to view this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get("/v1/users/:id", getUserController);

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user account
 *     tags: [Users v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.post("/v1/users", validateCreateUser, createUserController);

export default userRouter;
