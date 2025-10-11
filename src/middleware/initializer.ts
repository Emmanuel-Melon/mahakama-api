import { Application, Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { catchErrors, notFoundHandler } from "./errors";
import { healthMiddleware } from "./health";
import routes from "../routes";

export function initializeMiddlewares(app: Application): void {
  app.use(helmet());
  app.use(cors());

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.set("trust proxy", "loopback");
  app.get(["/health", "/api/health"], healthMiddleware);
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  // API routes - handle both /api/* and /* for Netlify Functions
  app.use("/api", routes); // For local development with /api prefix
  app.use(routes); // For Netlify Functions which already includes /api prefix

  app.use(notFoundHandler);
  app.use(catchErrors);
}
