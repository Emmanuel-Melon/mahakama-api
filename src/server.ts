import { serverConfig, isDev } from "@/config";
import app from "@/app";
import { logger } from "@/lib/logger";
import { shutdownExpressServer } from "@/lib/express";

if (require.main === module) {
  const server = app.listen(serverConfig.port, serverConfig.hostname, () => {
    const serverInfo = {
      "🚀 Environment": `[${serverConfig.env.toUpperCase()}]`,
      "🌍 Host": serverConfig.hostname,
      "🚪 Port": serverConfig.port,
      "🔒 Protocol": serverConfig.protocol,
      "⏱️  Started": new Date().toISOString(),
    };
    logger.info(serverInfo, "🚀 Mahakama Server");

    if (isDev) {
      const { endpoints } = serverConfig;
      const formattedEndpoints = {
        "🌐 API": endpoints.api,
        "📚 Documentation": endpoints.docs,
        "📄 OpenAPI Spec": endpoints.openApiSpec,
        "💓 Health Check": `${endpoints.api}${endpoints.health}`,
      };
      logger.info({ endpoints: formattedEndpoints }, "🔗 Available Endpoints");
    }
  });
  process.on("SIGTERM", () => shutdownExpressServer(server));
  process.on("SIGINT", () => shutdownExpressServer(server));
}

export default app;
