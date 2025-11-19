import { logger } from "../logger";
import { serverConfig } from "@/config";

export const shutdownExpressServer = async (server: any) => {
  logger.warn("SIGTERM received. Shutting down gracefully...");

  server.close(() => {
    logger.fatal("Process terminated");
    process.exit(0);
  });

  // Force close server after timeout
  setTimeout(() => {
    logger.error("Forcing shutdown after timeout");
    process.exit(1);
  }, serverConfig.shutdownTimeout);
};
