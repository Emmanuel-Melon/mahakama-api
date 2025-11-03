import { Response } from "express";
import { SuccessResponse, ErrorResponse, ResponseMetadata } from "./types";
import { HttpStatus, StatusConfig } from "./http-status";

export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  metadata?: ResponseMetadata & { status: StatusConfig },
): void => {
  const response: SuccessResponse<T> = {
    message: metadata?.status.defaultMessage,
    success: true,
    data,
    ...(metadata && { metadata }),
  };
  res.status(metadata?.status.statusCode!).json(response);
};

export const sendErrorResponse = (
  res: Response,
  status: StatusConfig,
  options: {
    message?: string;
    details?: Record<string, unknown>;
    overrideStatus?: number;
  } = {},
): void => {
  const statusCode = options.overrideStatus ?? status.statusCode;
  const message = options.message ?? status.defaultMessage;

  const error: ErrorResponse["error"] = {
    message,
    code: status.code,
  };

  if (
    options.details &&
    typeof options.details === "object" &&
    !Array.isArray(options.details)
  ) {
    error.details = options.details;
  }

  const response: ErrorResponse = {
    success: statusCode >= 200 && statusCode < 300,
    error,
  };

  res.status(statusCode).json(response);
};
