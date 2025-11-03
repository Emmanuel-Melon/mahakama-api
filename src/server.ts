import { config } from "./config";
import app from "./app";
import { logger } from "./lib/logger";

const port = config.port;

// Only start the server if this file is run directly
if (require.main === module) {
  const server = app.listen(port, () => {
    const env = process.env.NODE_ENV || "development";

    // Server Information
    const serverInfo = {
      "🚀 Environment": `[${env.toUpperCase()}]`,
      "🚪 Port": port,
      "⏱️  Started": new Date().toISOString(),
    };

    // Log server info
    logger.info(serverInfo, "🚀 Mahakama Server");

    // Log endpoints with emojis and colors
    const endpoints = {
      "🌐 API": `http://localhost:${port}/api`,
      "📚 Documentation": `http://localhost:${port}/api-docs`,
      "📄 OpenAPI Spec": `http://localhost:${port}/api-docs.json`,
    };

    logger.info({ endpoints }, "🔗 Available Endpoints");
    logger.info({}, "✅ Server is ready to handle requests");
  });

  // Handle shutdown gracefully
  const shutdown = async () => {
    logger.warn("SIGTERM received. Shutting down gracefully...");

    server.close(() => {
      logger.fatal("Process terminated");
      process.exit(0);
    });

    // Force close server after 5 seconds
    setTimeout(() => {
      logger.error("Forcing shutdown after timeout");
      process.exit(1);
    }, 5000);
  };

  // Handle different shutdown signals
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

export default app;
