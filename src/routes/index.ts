import { Router } from "express";
import documentRoutes, {
  DOCUMENTS_PATH,
} from "@/feature/documents/documents.routes";
import userRoutes, { USERS_PATH } from "@/feature/users/users.routes";
import lawyerRoutes, { LAWYERS_PATH } from "@/feature/lawyers/lawyer.routes";
import chatRoutes, { CHATS_PATH } from "@/feature/chats/chats.routes";
import { servicesRoutes, SERVICES_PATH } from "@/feature/services/services.routes";

export const AUTH_PATH = "/v1";
const BASE_PATH = "/api/v1";
const router = Router();

// Mount routes with their base paths
router.use(DOCUMENTS_PATH, documentRoutes);
router.use(USERS_PATH, userRoutes);
router.use(SERVICES_PATH, servicesRoutes);
router.use(LAWYERS_PATH, lawyerRoutes);
router.use(CHATS_PATH, chatRoutes);

export default router;

export const availableRoutes = [
  `${BASE_PATH}/auth`,
  `${BASE_PATH}${DOCUMENTS_PATH}`,
  `${BASE_PATH}${USERS_PATH}`,
  `${BASE_PATH}${LAWYERS_PATH}`,
  `${BASE_PATH}${CHATS_PATH}`,
] as const;
