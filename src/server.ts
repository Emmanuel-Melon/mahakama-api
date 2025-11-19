import { config, isDev } from "@/config/dev.config";
import app from "@/app";
import { logger } from "@/lib/logger";
import { shutdownExpressServer } from "@/lib/express";

if (require.main === module) {
  const server = app.listen(config.port, config.hostname, () => {
    const serverInfo = {
      "🚀 Environment": `[${config.env.toUpperCase()}]`,
      "🌍 Host": config.hostname,
      "🚪 Port": config.port,
      "🔒 Protocol": config.protocol,
      "⏱️  Started": new Date().toISOString(),
    };

    logger.info(serverInfo, "🚀 Mahakama Server");

    if (isDev) {
      const { endpoints } = config;
      const formattedEndpoints = {
        "🌐 API": endpoints.api,
        "📚 Documentation": endpoints.docs,
        "📄 OpenAPI Spec": endpoints.openApiSpec,
        "💓 Health Check": `${endpoints.api}${endpoints.health}`,
      };
      logger.info({ endpoints: formattedEndpoints }, "🔗 Available Endpoints");
    }

    logger.info({}, "✅ Server is ready to handle requests");
  });
  process.on("SIGTERM", () => shutdownExpressServer(server));
  process.on("SIGINT", () => shutdownExpressServer(server));
}

export default app;
