import { Application, Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { catchErrors, notFoundHandler } from "./errors";
import { healthMiddleware } from "./health";
import routes, { authRouter } from "../routes";
import { specs } from "../swagger";
import { getIpAddress } from "./ip-address";
import { authenticateToken } from "./auth";
import { requestLogger } from "./log-request";
import { userAgentMiddleware } from "./user-agent";
import { fingerprintMiddleware } from "./fingerprint";

const trustProxySetting =
  process.env.NODE_ENV === "production"
    ? 1 // Production: trust first proxy (Netlify)
    : "loopback"; // Development: trust localhost only

export function initializeMiddlewares(app: Application): void {
  app.use(helmet());
  const corsOptions = {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
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

  // Request logging
  app.use(requestLogger);

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss:
        ".swagger-ui .topbar { display: none }\n.swagger-ui .info { margin: 20px 0 }\n",
    }),
  );

  // Raw JSON schema endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  // Health check
  app.get(["/health", "/api/health"], healthMiddleware);

  // Apply middlewares to all routes
  app.use(userAgentMiddleware);
  app.use(fingerprintMiddleware);

  // Get IP address
  app.use(getIpAddress);

  // Mount routes with /api prefix for consistency
  app.use("/api", authenticateToken, routes);
  app.use("/auth", authRouter);
  // In development, also mount at root for convenience
  if (process.env.NODE_ENV === "development") {
    app.use("/", routes);
  }
  app.use(notFoundHandler);
  app.use(catchErrors);
}
