// utils/response.ts
// utils/handlerWrapper.ts
import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<T>;

export const handleAsync = <T>(handler: AsyncRequestHandler<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res, next);

      // If handler already sent response, don't send again
      if (!res.headersSent && result !== undefined) {
        res.json({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  };
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  metadata?: ApiResponse["metadata"],
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(metadata && { metadata }),
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
): void => {
  const response: ApiResponse = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
};
