import { Router } from "express";
import { documentRoutes } from "../documents/document.routes";
import userRoutes from "../users/user.routes";
import lawyerRoutes from "../lawyers/lawyer.routes";
import questionRoutes from "../questions/question.routes";
import chatRoutes from "../chats/chat.routes";
import authRoutes from "../auth/auth.routes";
import { userAgentMiddleware } from "../middleware/user-agent";
import { fingerprintMiddleware } from "../middleware/fingerprint";

// Base paths
const USERS_PATH = "/users";
const AUTH_PATH = "/auth";
const LAWYERS_PATH = "/lawyers";
const QUESTIONS_PATH = "/questions";
const CHATS_PATH = "/chats";
const DOCUMENTS_PATH = "/documents";

const router = Router();

// Apply middlewares to all routes
router.use(userAgentMiddleware);

// Auth routes (no fingerprint required)
router.use(AUTH_PATH, authRoutes);
router.use(fingerprintMiddleware);

// Mount routes with their base paths
router.use(DOCUMENTS_PATH, documentRoutes);
router.use(USERS_PATH, userRoutes);
router.use(LAWYERS_PATH, lawyerRoutes);
router.use(QUESTIONS_PATH, questionRoutes);
router.use(CHATS_PATH, chatRoutes);

export default router;
