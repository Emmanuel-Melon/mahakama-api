import { Response } from "express";
import { SuccessResponse, ErrorResponse, ResponseMetadata } from "./types";
import { internalServerError, requestSuccessResponse } from "./http-codes";

export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = requestSuccessResponse.statusCode,
  metadata?: ResponseMetadata,
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    data,

    ...(metadata && { metadata }),
  };
  res.status(statusCode).json(response);
};

// think of refatoring this so i could pass a string identifier such as NOT_FOUND, DUPLICATE, etc and then the function will handle mapping the statusCode, message, code, etc instead of passing it each time!
// maybe something like this:
// if (!lawyer) {
//   throw new NotFoundError("Lawyer", { id: lawyerId });
// }
export const sendErrorResponse = (
  res: Response,
  message: string = internalServerError.message,
  statusCode: number = internalServerError.statusCode,
  code: string = internalServerError.code,
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
