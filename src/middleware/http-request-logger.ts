import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { logRoute } from "@/lib/express/express.logs";
import { logger } from '@/lib/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = req.get("X-Request-ID") || randomUUID();
  const startTime = Date.now();

  res.setHeader("X-Request-ID", requestId);
  req.requestId = requestId;

  logger.info(
    {
      reqId: requestId,
      method: req.method,
      url: req.originalUrl,
      message: "Request received",
    },
    "Incoming request",
  );

  res.on("finish", () => {
    logRoute(req, res, startTime);
  });
  next();
};
