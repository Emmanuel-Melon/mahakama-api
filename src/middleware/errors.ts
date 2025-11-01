import { NextFunction, Response, Request } from "express";
import { logger } from "../lib/logger";

export interface ErrorMetadata {
  route?: string;
  handler?: string;
  operation?: string;
  resourceType?: string;
  resourceId?: string | number;
  includeDetails?: boolean;
  [key: string]: unknown;
}

type ErrorWithStatus = Error & {
  statusCode?: number;
  code?: string;
  details?: Record<string, unknown>;
  metadata?: ErrorMetadata;
};

// This will be populated by each router
const routeErrorMessages = new Map<string, string>();

const getRouteErrorMessage = (path: string): string => {
  for (const [route, message] of routeErrorMessages.entries()) {
    if (path.startsWith(route)) {
      return message;
    }
  }
  return "An unexpected error occurred";
};

export function notFoundHandler(req: Request, res: Response) {
  const errorMessage = `Route ${req.originalUrl} not found`;
  logger.warn(
    { path: req.path, method: req.method, url: req.originalUrl },
    errorMessage,
  );

  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: errorMessage,
      path: req.path,
      availableRoutes: [
        "/api/users",
        "/api/lawyers",
        "/api/documents",
        "/api/questions",
        "/health",
      ],
      timestamp: new Date().toISOString(),
    },
  });
}

export function catchErrors(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || getRouteErrorMessage(req.path);
  const isClientError = statusCode >= 400 && statusCode < 500;

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: errorMessage,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
      ...(err.metadata && { metadata: err.metadata }),
      ...(process.env.NODE_ENV !== "production" && {
        stack: err.stack?.split("\n").map((line) => line.trim()),
      }),
    },
  };

  // Log the error with appropriate level and request context
  const logContext = {
    reqId: req.requestId,
    statusCode,
    errorCode: err.code,
    path: req.path,
    method: req.method,
    ...(req.user?.id && { userId: req.user.id }),
    ...(req.fingerprint?.hash && { fingerprint: req.fingerprint.hash }),
    ...(req.userAgent && {
      userAgent: {
        browser: req.userAgent.browser,
        os: req.userAgent.os,
        platform: req.userAgent.platform,
        device: req.userAgent.deviceType,
      },
    }),
    ...(err.details && { details: err.details }),
    ...(err.metadata && { metadata: err.metadata }),
    rawError: err
  };

  if (statusCode >= 500) {
    logger.error(logContext, `Server Error: ${errorMessage}`);
  } else if (isClientError) {
    logger.warn(logContext, `Client Error: ${errorMessage}`);
  } else {
    logger.info(logContext, `Error: ${errorMessage}`);
  }

  // In production, don't leak error details unless explicitly allowed
  if (process.env.NODE_ENV === "production" && !err.metadata?.includeDetails) {
    if (statusCode >= 500) {
      errorResponse.error.message = "An internal server error occurred";
    }
    delete errorResponse.error.stack;
  }

  res.status(statusCode).json(errorResponse);
}

// Custom error classes
export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, unknown>;
  metadata?: ErrorMetadata;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    details?: Record<string, unknown>,
    metadata?: ErrorMetadata,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }

  withMetadata(metadata: ErrorMetadata): this {
    this.metadata = { ...this.metadata, ...metadata };
    return this;
  }
}

export class NotFoundError extends ApiError {
  constructor(
    resource: string,
    details?: Record<string, unknown>,
    metadata?: ErrorMetadata,
  ) {
    super(`${resource} not found`, 404, "NOT_FOUND", details, {
      resourceType: resource.toLowerCase(),
      ...metadata,
    });
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    metadata?: ErrorMetadata,
  ) {
    super(message, 400, "VALIDATION_ERROR", details, {
      ...metadata,
      includeDetails: true,
    });
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized access", metadata?: ErrorMetadata) {
    super(message, 401, "UNAUTHORIZED", undefined, metadata);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Insufficient permissions", metadata?: ErrorMetadata) {
    super(message, 403, "FORBIDDEN", undefined, metadata);
  }
}
