import { Router } from "express";
import { getDocumentById } from "./controllers/get-document-by-id.controller";
import { getDocuments } from "./controllers/get-documents.controller";
import { createDocumentHandler } from "./controllers/create-document.controller";
import { bookmarkDocumentHandler } from "./controllers/bookmark-document.controller";
import { downloadDocumentHandler } from "./controllers/downoad-document.controller";
import { registerRouteErrorMessages } from "../middleware/errors";

export const DOCUMENTS_PATH = "/v1/documents";

const documentRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Documents v1
 *     description: Document management endpoints
 *
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the document
 *         title:
 *           type: string
 *           description: Title of the document
 *         description:
 *           type: string
 *           description: Description of the document
 *         type:
 *           type: string
 *           description: Type/category of the document
 *         sections:
 *           type: integer
 *           description: Number of sections in the document
 *         lastUpdated:
 *           type: string
 *           format: date
 *           description: Last updated year (YYYY)
 *         downloadCount:
 *           type: integer
 *           description: Number of times the document has been downloaded
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of documents per page
 *     responses:
 *       200:
 *         description: A list of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
documentRoutes.get("/", getDocuments);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get a document by ID
 *     tags: [Documents v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 */
documentRoutes.get("/:id", getDocumentById);

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents v1]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - sections
 *               - lastUpdated
 *               - storageUrl
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the document
 *               description:
 *                 type: string
 *                 description: Description of the document
 *               type:
 *                 type: string
 *                 description: Type/category of the document
 *               sections:
 *                 type: integer
 *                 description: Number of sections in the document
 *               lastUpdated:
 *                 type: string
 *                 format: date
 *                 description: Last updated year (YYYY)
 *               storageUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL to the document storage
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: Invalid input
 */
documentRoutes.post("/", createDocumentHandler);

/**
 * @swagger
 * /api/documents/{id}/bookmark:
 *   post:
 *     summary: Bookmark a document
 *     tags: [Documents v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document bookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     documentId:
 *                       type: integer
 *                     bookmarked:
 *                       type: boolean
 */
documentRoutes.post("/:id/bookmark", bookmarkDocumentHandler);

/**
 * @swagger
 * /api/documents/{id}/download:
 *   get:
 *     summary: Download a document
 *     tags: [Documents v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document download initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     documentId:
 *                       type: integer
 *                     downloadUrl:
 *                       type: string
 *                     downloadCount:
 *                       type: integer
 */
documentRoutes.get("/:id/download", downloadDocumentHandler);

export default documentRoutes;
