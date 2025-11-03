import { Router } from "express";
import documentRoutes, { DOCUMENTS_PATH } from "../documents/documents.routes";
import userRoutes, { USERS_PATH } from "../users/users.routes";
import lawyerRoutes, { LAWYERS_PATH } from "../lawyers/lawyer.routes";
import chatRoutes, { CHATS_PATH } from "../chats/chats.routes";
import authRoutes, { AUTH_PATH } from "../auth/auth.routes";

const router = Router();
export const authRouter = Router();

// Auth routes (no fingerprint required)
authRouter.use(AUTH_PATH, authRoutes);

// Mount routes with their base paths
router.use(DOCUMENTS_PATH, documentRoutes);
router.use(USERS_PATH, userRoutes);
router.use(LAWYERS_PATH, lawyerRoutes);
router.use(CHATS_PATH, chatRoutes);

export default router;

export const availableRoutes = [
  `/auth${AUTH_PATH}`,
  `/api${DOCUMENTS_PATH}`,
  `/api${USERS_PATH}`,
  `/api${LAWYERS_PATH}`,
  `/api${CHATS_PATH}`,
] as const;

export const swaggerApiRoutes = [
  "./src/routes/*.ts", // Main API routes
  "./src/auth/*.ts", // Authentication routes
  "./src/chats/*.ts", // Chat-related routes
  "./src/users/*.ts", // User-related routes
  "./src/questions/*.ts", // Question-related routes
  "./src/lawyers/*.ts", // Lawyer-related routes
  "./src/health/*.ts", // Health check route
] as const;
