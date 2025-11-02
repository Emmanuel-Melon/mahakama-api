import { Response } from "express";
import { SuccessResponse, ErrorResponse, ResponseMetadata } from "./types";

export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  metadata?: ResponseMetadata,
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    data,

    ...(metadata && { metadata }),
  };
  res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: Record<string, unknown>, // Changed from unknown to Record<string, unknown>
): void => {
  const error: ErrorResponse["error"] = {
    message,
    ...(code && { code }),
  };

  // Only add details if it's an object and not null/undefined
  if (details && typeof details === "object" && !Array.isArray(details)) {
    error.details = details;
  }

  const response: ErrorResponse = {
    success: false,
    error,
  };

  res.status(statusCode).json(response);
};
