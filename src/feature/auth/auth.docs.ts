/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization
 */

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
 *     tags: [Authentication]
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
 */

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Authenticates a user with email and password
 *     tags: [Authentication]
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

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     summary: Logout the current user
 *     description: Clears the authentication token and logs out the user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Clears the JWT token by setting an expired cookie
 *       401:
 *         description: Unauthorized (if no valid token provided)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */