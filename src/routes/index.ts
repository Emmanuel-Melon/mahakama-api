import { Router } from "express";
import { documentRoutes } from "../documents/document.routes";
import userRoutes from "../users/user.routes";
import lawyerRoutes from "../lawyers/lawyer.routes";
import chatRoutes from "../chats/chat.routes";
import authRoutes from "../auth/auth.routes";
import { userAgentMiddleware } from "../middleware/user-agent";
import { fingerprintMiddleware } from "../middleware/fingerprint";

// Base paths
const USERS_PATH = "/v1/users";
const AUTH_PATH = "/v1";
const LAWYERS_PATH = "/v1/lawyers";
const CHATS_PATH = "/v1/chats";
const DOCUMENTS_PATH = "/v1/documents";

const router = Router();
export const authRouter = Router();

// Apply middlewares to all routes
router.use(userAgentMiddleware);

// Auth routes (no fingerprint required)
authRouter.use(AUTH_PATH, authRoutes);
router.use(fingerprintMiddleware);

// Mount routes with their base paths
router.use(DOCUMENTS_PATH, documentRoutes);
router.use(USERS_PATH, userRoutes);
router.use(LAWYERS_PATH, lawyerRoutes);
router.use(CHATS_PATH, chatRoutes);

export default router;
