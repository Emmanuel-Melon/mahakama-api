import { Router } from "express";
import documentRoutes, { DOCUMENTS_PATH } from "../documents/document.routes";
import userRoutes, { USERS_PATH } from "../users/users.routes";
import lawyerRoutes, { LAWYERS_PATH } from "../lawyers/lawyer.routes";
import chatRoutes, { CHATS_PATH } from "../chats/chat.routes";
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
