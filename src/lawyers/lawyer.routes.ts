import { Router } from "express";
import { getLawyers } from "./controllers/getLawyers.controller";
import { getLawyerById } from "./controllers/getLawyerById.controller";
import { getLawyerByEmail } from "./controllers/getLawyerByEmail.controller";
import { createLawyerHandler } from "./controllers/createLawyer.controller";
import { updateLawyerHandler } from "./controllers/updateLawyer.controller";

const lawyerRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Lawyers v1
 *     description: Lawyer management endpoints
 *
 * @swagger
 * components:
 *   schemas:
 *     Lawyer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the lawyer
 *         email:
 *           type: string
 *           format: email
 *           description: Lawyer's email address
 *         name:
 *           type: string
 *           description: Full name of the lawyer
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         specialization:
 *           type: string
 *           description: Legal specialization area
 *         experience:
 *           type: integer
 *           description: Years of experience
 *         barNumber:
 *           type: string
 *           description: Bar association registration number
 *         isVerified:
 *           type: boolean
 *           default: false
 *           description: Whether the lawyer's credentials have been verified
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: Languages spoken by the lawyer
 *         bio:
 *           type: string
 *           description: Professional biography
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateLawyerRequest:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - barNumber
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "lawyer@example.com"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         specialization:
 *           type: string
 *           example: "Family Law"
 *         experience:
 *           type: integer
 *           example: 5
 *         barNumber:
 *           type: string
 *           example: "BAR12345"
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           example: ["English", "French"]
 *         bio:
 *           type: string
 *           example: "Experienced family law attorney with 5+ years of practice"
 *
 *     UpdateLawyerRequest:
 *       type: object
 *       properties:
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         specialization:
 *           type: string
 *           example: "Corporate Law"
 *         experience:
 *           type: integer
 *           example: 7
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           example: ["English", "French", "Spanish"]
 *         bio:
 *           type: string
 *           example: "Updated bio with more experience"
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
 * /v1/lawyers:
 *   get:
 *     summary: Get all lawyers
 *     description: Returns a list of all registered lawyers with optional filtering
 *     tags: [Lawyers v1]
 *     parameters:
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filter lawyers by specialization
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum years of experience
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language spoken
 *     responses:
 *       200:
 *         description: List of lawyers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lawyer'
 */
lawyerRoutes.get("/", getLawyers);

/**
 * @swagger
 * /v1/lawyers/{id}:
 *   get:
 *     summary: Get lawyer by ID
 *     description: Returns a single lawyer by their unique identifier
 *     tags: [Lawyers v1]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lawyer's unique identifier
 *     responses:
 *       200:
 *         description: Lawyer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lawyer'
 *       404:
 *         description: Lawyer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
lawyerRoutes.get("/:id", getLawyerById);

/**
 * @swagger
 * /v1/lawyers/email:
 *   get:
 *     summary: Get lawyer by email
 *     description: Returns a single lawyer by their email address
 *     tags: [Lawyers v1]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Lawyer's email address
 *     responses:
 *       200:
 *         description: Lawyer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lawyer'
 *       404:
 *         description: Lawyer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
lawyerRoutes.get("/email", getLawyerByEmail);

/**
 * @swagger
 * /v1/lawyers:
 *   post:
 *     summary: Create a new lawyer profile
 *     description: Register a new lawyer in the system
 *     tags: [Lawyers v1]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLawyerRequest'
 *     responses:
 *       201:
 *         description: Lawyer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lawyer'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Lawyer with this email or bar number already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
lawyerRoutes.post("/", createLawyerHandler);

/**
 * @swagger
 * /v1/lawyers/{id}:
 *   put:
 *     summary: Update lawyer profile
 *     description: Update an existing lawyer's information
 *     tags: [Lawyers v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lawyer's unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLawyerRequest'
 *     responses:
 *       200:
 *         description: Lawyer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lawyer'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lawyer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
lawyerRoutes.put("/:id", updateLawyerHandler);

export default lawyerRoutes;
