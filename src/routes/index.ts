import { Router } from "express";
import documentRoutes, { DOCUMENTS_PATH } from "../documents/documents.routes";
import userRoutes, { USERS_PATH } from "../users/users.routes";
import lawyerRoutes, { LAWYERS_PATH } from "../lawyers/lawyer.routes";
import chatRoutes, { CHATS_PATH } from "../chats/chats.routes";
import authRoutes from "../auth/auth.routes";

export const AUTH_PATH = "/v1";
const BASE_PATH = "/api/v1";

const router = Router();

// Mount routes with their base paths
router.use(DOCUMENTS_PATH, documentRoutes);
router.use(USERS_PATH, userRoutes);
router.use(LAWYERS_PATH, lawyerRoutes);
router.use(CHATS_PATH, chatRoutes);

// Export the auth routes
export { authRoutes };

export default router;

export const availableRoutes = [
  `${BASE_PATH}/auth`,
  `${BASE_PATH}${DOCUMENTS_PATH}`,
  `${BASE_PATH}${USERS_PATH}`,
  `${BASE_PATH}${LAWYERS_PATH}`,
  `${BASE_PATH}${CHATS_PATH}`,
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
