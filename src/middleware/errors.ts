import { NextFunction, Response, Request } from "express";

export interface ErrorMetadata {
  route?: string;
  handler?: string;
  operation?: string;
  resourceType?: string;
  resourceId?: string | number;
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

/**
 * Registers error messages for specific routes
 * @param basePath The base path to register the error message for
 * @param message The default error message for this route
 */
export function registerRouteErrorMessages(
  basePath: string,
  message: string,
): void {
  routeErrorMessages.set(basePath, message);
}

const getRouteErrorMessage = (path: string): string => {
  for (const [route, message] of routeErrorMessages.entries()) {
    if (path.startsWith(route)) {
      return message;
    }
  }
  return "An unexpected error occurred";
};

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.originalUrl} not found`,
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
  const isProduction = process.env.NODE_ENV === "production";
  const errorMessage = err.message || getRouteErrorMessage(req.path);

  // Log the full error in development, but only the message in production
  if (isProduction) {
    console.error(`[${new Date().toISOString()}] Error: ${errorMessage}`, {
      path: req.path,
      method: req.method,
      statusCode,
      errorCode: err.code,
    });
  } else {
    console.error(err.stack);
  }

  // Define error response type
  interface ErrorResponse {
    success: boolean;
    error: {
      code: string;
      message: string;
      path: string;
      method: string;
      timestamp: string;
      metadata?: ErrorMetadata;
      details?: Record<string, unknown>;
      stack?: string[];
    };
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: errorMessage,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
      ...(err.metadata && { metadata: err.metadata }),
    },
  };

  // Include error details if available (in development or if explicitly included)
  if ((!isProduction || err.metadata?.includeDetails) && err.details) {
    errorResponse.error.details = err.details;
  }

  // Include stack trace in development
  if (!isProduction && err.stack) {
    errorResponse.error.stack = err.stack
      .split("\n")
      .map((line) => line.trim());
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

    // Maintain proper stack trace
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
    super(message, 400, "VALIDATION_ERROR", details, metadata);
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
