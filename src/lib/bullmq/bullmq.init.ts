import { logger } from "../logger";
import { initAuthWorker } from "@/feature/auth/jobs/auth.worker";
import { initDocumentsWorker } from "@/feature/documents/jobs/documents.worker";

export const initAllWorkers = () => {
  logger.info("👷 Initializing background workers...");
  initAuthWorker();
  initDocumentsWorker();
};
