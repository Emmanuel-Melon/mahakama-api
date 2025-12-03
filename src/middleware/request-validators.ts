import { NextFunction, Response, Request } from "express";
import { z, ZodTypeAny } from "zod";
import { sendErrorResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/express/http-status-codes";

export function validateRequestBody<T extends z.ZodTypeAny>(schema: T) {
  type SchemaType = z.infer<T>;
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const formattedErrors = result.error.format();
        return sendErrorResponse(req, res, {
          status: HttpStatus.BAD_REQUEST,
          message: "Request validation failed",
          source: {
            pointer: req.originalUrl,
            method: req.method,
          },
          config: { ...formattedErrors, requestId: req.requestId },
        });
      }
      req.validatedBody = result.data as SchemaType;
      next();
    } catch (error) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred during validation",
      });
    }
  };
}

export function validateRequestParams<T extends z.ZodType<Record<string, any>>>(
  schema: T,
) {
  type ParamsType = z.infer<T>;
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const formattedErrors = result.error.format();
      return sendErrorResponse(req, res, {
        status: HttpStatus.BAD_REQUEST,
        message: "Request validation failed",
        source: {
          pointer: req.originalUrl,
          method: req.method,
        },
        config: { ...formattedErrors, requestId: req.requestId },
      });
    }
    req.validatedParams = result.data as ParamsType;
    return next();
  };
}

export function validateRequestQuery<T extends z.ZodType<Record<string, any>>>(
  schema: T,
) {
  type QueryType = z.infer<T>;
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const formattedErrors = result.error.format();
      return sendErrorResponse(req, res, {
        status: HttpStatus.BAD_REQUEST,
        message: "Request validation failed",
        source: {
          pointer: req.originalUrl,
          method: req.method,
        },
        config: { ...formattedErrors, requestId: req.requestId },
      });
    }
    req.validatedQuery = result.data as QueryType;
    return next();
  };
}

export function validateRequestHeaders<
  T extends z.ZodType<Record<string, any>>,
>(schema: T) {
  type HeadersType = z.infer<T>;
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.headers);
    if (!result.success) {
      const formattedErrors = result.error.format();
      const isAuthError =
        (formattedErrors as any).authorization?._errors?.length > 0 ||
        (formattedErrors as any)["x-access-token"]?._errors?.length > 0;

      return sendErrorResponse(req, res, {
        status: isAuthError ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST,
        message: isAuthError
          ? "Authentication required: Missing or invalid 'authorization' or 'x-access-token' header"
          : "Request Header Validation Failed",
        source: {
          pointer: req.originalUrl,
          method: req.method,
        },
        config: {
          ...formattedErrors,
          requestId: req.requestId,
        },
      });
    }
    req.validatedHeaders = result.data as HeadersType;
    return next();
  };
}
