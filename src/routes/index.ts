import { Router } from "express";
import { authenticateToken, optionalAuth, methodBasedAuth } from "@/middleware/auth";
import documentRoutes, {
  DOCUMENTS_PATH,
} from "@/feature/documents/documents.routes";
import userRoutes, { USERS_PATH } from "@/feature/users/users.routes";
import lawyerRoutes, { LAWYERS_PATH } from "@/feature/lawyers/lawyer.routes";
import chatRouter, { CHATS_PATH } from "@/feature/chats/chats.routes";
import {
  servicesRouter,
  SERVICES_PATH,
} from "@/feature/services/services.routes";
import messagesRoutes, {
  MESSAGES_PATH,
} from "@/feature/messages/messages.routes";

export const AUTH_PATH = "/v1";
const BASE_PATH = "/api/v1";
const mahakamaRouter = Router();

// PUBLIC ROUTES
mahakamaRouter.use(DOCUMENTS_PATH, methodBasedAuth, documentRoutes);
mahakamaRouter.use(SERVICES_PATH, methodBasedAuth, servicesRouter);
mahakamaRouter.use(LAWYERS_PATH, methodBasedAuth, lawyerRoutes);

// PRIVATE ROUTES
mahakamaRouter.use(USERS_PATH, authenticateToken, userRoutes);
mahakamaRouter.use(CHATS_PATH, authenticateToken, chatRouter);
mahakamaRouter.use(MESSAGES_PATH, authenticateToken, messagesRoutes);

export default mahakamaRouter;

export const availableRoutes = [
  `${BASE_PATH}/auth`,
  `${BASE_PATH}${DOCUMENTS_PATH}`,
  `${BASE_PATH}${USERS_PATH}`,
  `${BASE_PATH}${LAWYERS_PATH}`,
  `${BASE_PATH}${CHATS_PATH}`,
  `${BASE_PATH}${MESSAGES_PATH}`,
] as const;