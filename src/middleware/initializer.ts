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

  // API routes
  // In Netlify, the base path is already set to /.netlify/functions/api
  // In local development, we need to add the /api prefix
  if (process.env.NETLIFY_DEV) {
    // When running locally with Netlify Dev, use /api prefix
    app.use("/api", routes);
  } else if (process.env.NODE_ENV === 'development') {
    // When running with regular development server (npm run dev)
    app.use("/api", routes);
  } else {
    // In production (Netlify Functions), use the root path
    app.use("/", routes);
  }

  app.use(notFoundHandler);
  app.use(catchErrors);
}
