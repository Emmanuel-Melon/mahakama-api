import { Application, Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { catchErrors, notFoundHandler } from "./errors";
import { healthMiddleware } from "./health";
import routes, { authRoutes } from "../routes";
import { apiSpecs } from "../swagger";
import { getIpAddress } from "./ip-address";
import { authenticateToken } from "./auth";
import { requestLogger } from "./log-request";
import { userAgentMiddleware } from "./user-agent";
import { fingerprintMiddleware } from "./fingerprint";
import { corsOrigins } from "../config";

const trustProxySetting =
  process.env.NODE_ENV === "production"
    ? 1 // Production: trust first proxy (railyway)
    : "loopback"; // Development: trust localhost only

export function initializeMiddlewares(app: Application): void {
  app.use(helmet());
  const corsOptions = {
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.set("trust proxy", trustProxySetting); // for detecting ips

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(apiSpecs, {
      explorer: true,
      customCss: ".swagger-ui \n.swagger-ui .info { margin: 20px 0 }\n",
    }),
  );

  // Raw JSON schema endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiSpecs);
  });

  // Health check
  app.get(["/health", "/api/health"], healthMiddleware);

  // Apply middlewares to all routes
  app.use(userAgentMiddleware);
  app.use(fingerprintMiddleware);

  // Get IP address
  app.use(getIpAddress);

  // Request logging
  app.use(requestLogger);
  app.use("/api/v1/auth", authRoutes); // Auth routes at /api/v1/auth

  // Mount routes with appropriate prefixes
  app.use("/api", authenticateToken, routes); // API routes with authentication

  // In development, also mount at root for convenience
  if (process.env.NODE_ENV === "development") {
    app.use("/", routes);
  }
  app.use(notFoundHandler);
  app.use(catchErrors);
}
