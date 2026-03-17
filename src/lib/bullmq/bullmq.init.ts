import { initAuthWorker } from "@/feature/auth/workers/auth.workers";
import { logger } from "../logger";

export const initAllWorkers = () => {
  logger.info("👷 Initializing background workers...");
  initAuthWorker();
};
