import { Request, Response, NextFunction } from "express";
import { logger } from "@/lib/logger";
import { sendErrorResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { serverConfig } from "@/config";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    description: string,
    public isOperational = true,
  ) {
    super(description);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = 500;
  let statusConfig = HttpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = statusConfig.description;
  let errorMeta: Record<string, any> = {};

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorMessage = error.message;
    statusConfig =
      Object.values(HttpStatus).find((s) => s.statusCode === statusCode) ||
      HttpStatus.INTERNAL_SERVER_ERROR;
  } else if (error instanceof ZodError) {
    statusConfig = HttpStatus.BAD_REQUEST;
    errorMessage = "Validation error";
    errorMeta.validationErrors = error.issues;
  } else if (error.name === "UnauthorizedError") {
    statusConfig = HttpStatus.UNAUTHORIZED;
    errorMessage = "Invalid or expired token";
  } else if (error.name === "MulterError") {
    statusConfig = HttpStatus.BAD_REQUEST;
    errorMessage = `File upload error: ${error.message}`;
  }

  const errorLog = {
    requestId: req.requestId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        isOperational: error.isOperational,
      }),
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: res.locals.clientIp,
    },
    timestamp: new Date().toISOString(),
  };

  if (error instanceof AppError && error.isOperational) {
    logger.warn(errorLog, `Operational error: ${errorMessage}`);
  } else {
    logger.error(errorLog, `Unhandled error: ${error.message}`);
  }

  sendErrorResponse(
    req,
    res,
    {
      status: statusConfig,
      description: errorMessage,
      source: {
        pointer: req.originalUrl,
        method: req.method,
      },
    },
    {
      additionalMeta: {
        ...errorMeta,
        ...(serverConfig.isDevelopment && {
          stack: error.stack,
          errorType: error.constructor.name,
        }),
      },
    },
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn(
    {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      ip: res.locals.clientIp,
    },
    `Route not found: ${req.method} ${req.originalUrl}`,
  );
  sendErrorResponse(req, res, {
    status: HttpStatus.NOT_FOUND,
    description: `Route ${req.method} ${req.originalUrl} not found`,
    source: {
      pointer: req.originalUrl,
      method: req.method,
    },
  });
};
