import { Router } from "express";
import { validate } from "../middleware/request-validators";
import { getUsersController } from "./controllers/get-users.controller";
import { getUserController } from "./controllers/get-user.controller";
import { createUserController } from "./controllers/create-user.controller";
import { updateUserController } from "./controllers/update-user.controller";
import { createUserSchema } from "./users.schema";

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
 *         fingerprint:
 *           type: string
 *           description: Browser fingerprint for session management
 *         userAgent:
 *           type: string
 *           description: User agent string from the browser
 *         isAnonymous:
 *           type: boolean
 *           default: false
 *           description: Whether the user is anonymous
 *         age:
 *           type: number
 *           description: User's age
 *         gender:
 *           type: string
 *           enum: [male, female, non_binary, prefer_not_to_say, other]
 *           description: User's gender
 *         country:
 *           type: string
 *           description: User's country
 *         city:
 *           type: string
 *           description: User's city
 *         phoneNumber:
 *           type: string
 *           description: User's phone number
 *         occupation:
 *           type: string
 *           description: User's occupation
 *         bio:
 *           type: string
 *           description: User's biography
 *         profilePicture:
 *           type: string
 *           format: uri
 *           description: URL to user's profile picture
 *         isOnboarded:
 *           type: boolean
 *           default: false
 *           description: Whether the user has completed onboarding
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *
 *     CreateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           description: User's full name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           description: User's email address
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 255
 *           description: User's password
 *           example: "securePassword123"
 *         role:
 *           type: string
 *           enum: [user, admin, lawyer]
 *           default: "user"
 *           description: User's role in the system
 *           example: "user"
 *         fingerprint:
 *           type: string
 *           description: Browser fingerprint for session management
 *         userAgent:
 *           type: string
 *           description: User agent string from the browser
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
 *     description: Returns a paginated list of users with filtering and sorting options
 *     tags: [Users v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of users to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, email]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (asc or desc)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter users by name or email
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
 *     description: Retrieve user details by user ID. Users can only view their own profile unless they are admins.
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
 *         description: User ID to retrieve
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
userRouter.get("/:id", getUserController);

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user account. Can be used for both anonymous and registered users.
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
userRouter.post("/", validate(createUserSchema), createUserController);

/**
 * @swagger
 * /v1/users/{id}:
 *   patch:
 *     summary: Update user information
 *     description: Update user profile information. Users can only update their own profile unless they are admins.
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
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 255
 *                 description: User's full name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: User's email address
 *                 example: "user@example.com"
 *               role:
 *                 type: string
 *                 enum: [user, admin, lawyer]
 *                 description: User's role in the system
 *                 example: "user"
 *               age:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 description: User's age
 *                 example: 30
 *               gender:
 *                 type: string
 *                 enum: [male, female, non_binary, prefer_not_to_say, other]
 *                 description: User's gender
 *                 example: "male"
 *               country:
 *                 type: string
 *                 maxLength: 100
 *                 description: User's country
 *                 example: "Kenya"
 *               city:
 *                 type: string
 *                 maxLength: 100
 *                 description: User's city
 *                 example: "Nairobi"
 *               phoneNumber:
 *                 type: string
 *                 maxLength: 20
 *                 description: User's phone number
 *                 example: "+254700000000"
 *               occupation:
 *                 type: string
 *                 maxLength: 100
 *                 description: User's occupation
 *                 example: "Software Engineer"
 *               bio:
 *                 type: string
 *                 description: User's biography
 *                 example: "Passionate about technology and innovation"
 *               profilePicture:
 *                 type: string
 *                 format: uri
 *                 description: URL to user's profile picture
 *                 example: "https://example.com/profile.jpg"
 *               isOnboarded:
 *                 type: boolean
 *                 description: Whether the user has completed onboarding
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not authorized to update this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.patch(
  "/:id",
  validate(createUserSchema.partial()),
  updateUserController,
);

export default userRouter;
export const USERS_PATH = "/v1/users";
