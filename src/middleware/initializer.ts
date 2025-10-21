import { Application, Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { catchErrors, notFoundHandler } from "./errors";
import { healthMiddleware } from "./health";
import routes from "../routes";
import { specs } from "../swagger";

export function initializeMiddlewares(app: Application): void {
  app.use(helmet());
  app.use(cors());

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.set("trust proxy", "loopback");

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );

  // Health check
  app.get(["/health", "/api/health"], healthMiddleware);

  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  // API routes
  // Always use /api prefix for consistency
  app.use("/api", routes);

  // For local development (non-Netlify), also mount at root
  if (process.env.NODE_ENV === "development" && !process.env.NETLIFY_DEV) {
    app.use("/", routes);
  }

  app.use(notFoundHandler);
  app.use(catchErrors);
}
