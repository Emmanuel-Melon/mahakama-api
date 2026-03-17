import { logger } from "../logger";
import { initAuthWorker } from "@/feature/auth/jobs/auth.worker";
import { initChatsWorker } from "@/feature/chats/jobs/chats.worker";
import { initDocumentsWorker } from "@/feature/documents/jobs/documents.worker";
import { initLawyersWorker } from "@/feature/lawyers/jobs/lawyers.worker";

export const initAllWorkers = () => {
  logger.info("👷 Initializing background workers...");
  initAuthWorker();
  initDocumentsWorker();
  initChatsWorker();
  initLawyersWorker();
};
