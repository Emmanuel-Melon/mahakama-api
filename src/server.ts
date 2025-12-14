import { serverConfig, isDev } from "@/config";
import app from "@/app";
import { logger } from "@/lib/logger";
import { shutdownExpressServer } from "@/lib/express";

const createClickableLink = (url: string, text: string): string => {
  return `\x1B]8;;${url}\x1B\\${text}\x1B]8;;\x1B\\`;
};

const { endpoints } = serverConfig;
const formattedEndpoints = {
  "🌐 API": createClickableLink(endpoints.api, endpoints.api),
  "📚 Documentation": createClickableLink(endpoints.docs, endpoints.docs),
  "📄 OpenAPI Spec": createClickableLink(endpoints.openApiSpec, "View Spec"),
  "💓 Health Check": createClickableLink(
    `${endpoints.api}${endpoints.health}`,
    "Check Health",
  ),
};

if (require.main === module) {
  const server = app.listen(serverConfig.port, serverConfig.hostname, () => {
    const baseUrl = `${serverConfig.protocol}://${serverConfig.hostname}:${serverConfig.port}`;
    if (isDev) {
      const { endpoints } = serverConfig;
      logger.info("\n🔗 Available Endpoints:");
      logger.info(`  🌐 API: ${baseUrl}${endpoints.api}`);
      logger.info(`  📚 Documentation: ${baseUrl}${endpoints.docs}`);
      logger.info(`  📄 OpenAPI Spec: ${baseUrl}${endpoints.openApiSpec}`);
      logger.info(
        `  💓 Health Check: ${baseUrl}${endpoints.api}${endpoints.health}`,
      );
    }
  });

  process.on("SIGTERM", () => shutdownExpressServer(server));
  process.on("SIGINT", () => shutdownExpressServer(server));
}

export default app;
