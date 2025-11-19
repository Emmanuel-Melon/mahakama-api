import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { logger } from "@/lib/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = req.get("X-Request-ID") || randomUUID();
  const startTime = Date.now();

  logger.info(
    {
      reqId: requestId,
      method: req.method,
      url: req.originalUrl,
      message: "Request received",
    },
    "Incoming request",
  );

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logData = {
      reqId: requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      message: "Request completed",
    };

    // Log with appropriate level based on status code and duration
    if (res.statusCode >= 500) {
      logger.error(logData, "Request error");
    } else if (res.statusCode >= 400) {
      logger.warn(logData, "Client error");
    } else if (duration > 1000) {
      logger.warn(logData, "Slow request");
    } else {
      logger.info(logData, "Request completed");
    }
  });

  // Add request ID to response headers and request object
  res.setHeader("X-Request-ID", requestId);
  req.requestId = requestId;

  next();
};
