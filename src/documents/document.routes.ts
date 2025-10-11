import { Router } from "express";
import { getDocumentById } from "./controllers/getDocumentById.controller";
import { getDocuments } from "./controllers/getDocuments.controller";
import { createDocumentHandler } from "./controllers/createDocument.controller";
import { registerRouteErrorMessages } from "../middleware/errors";

// Register error messages for document routes
const BASE_PATH = "/api/documents";
registerRouteErrorMessages(
  BASE_PATH,
  "An error occurred while processing your document request"
);

const documentRoutes = Router();

// Document routes
documentRoutes.get("/", getDocuments);
documentRoutes.get("/:id", getDocumentById);
documentRoutes.post("/", createDocumentHandler);

export { documentRoutes, BASE_PATH };
export default documentRoutes;
