import { NextFunction, Response, Request } from "express";
import { z, ZodTypeAny } from "zod";
import { sendErrorResponse } from "@/lib/express/express.response";
import { TypedRequestParams, TypedRequestQuery } from "@/lib/express/express.types";
import { HttpStatus } from "@/lib/express/http-status";

export function validateRequestBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const formattedErrors = result.error.format();
        const requestId = (req as any).id || "unknown";
        return sendErrorResponse(
          res,
          HttpStatus.BAD_REQUEST,
          {
            details: { ...formattedErrors, requestId },
            message: "Request validation failed"
          }
        );
      }
      req.body = result.data;
      next();
    } catch (error) {
      return sendErrorResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { message: "An unexpected error occurred during validation" }
      );
    }
  };
}

export function validateRequestParams<T extends z.ZodTypeAny>(schema: T) {
  return (req: TypedRequestParams<T>, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      Object.assign(req.params, parsed);
      next();
    } catch (error: any) {
      return sendErrorResponse(
        res,
        HttpStatus.BAD_REQUEST,
        {
          message: "Invalid URL parameters",
          details: { errors: error.errors }
        }
      );
    }
  };
}

export function validateRequestQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: TypedRequestQuery<T>, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      Object.assign(req.query, parsed);
      next();
    } catch (error: any) {
      return sendErrorResponse(
        res,
        HttpStatus.BAD_REQUEST,
        {
          message: "Invalid query parameters",
          details: { errors: error.errors }
        }
      );
    }
  };
}

export function validateRequestHeaders<
  T extends z.ZodType<Record<string, any>>,
>(schema: T) {
  type HeadersType = z.infer<T>;
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.headers);
      if (!result.success) {
        const formattedErrors = result.error.format();
        return sendErrorResponse(
          res,
          HttpStatus.BAD_REQUEST,
          {
            message: "Request Headers validation failed",
            details: { errors: formattedErrors }
          }
        );
      }
      req.validatedHeaders = result.data as HeadersType;
      return next();
    } catch (error) {
      return sendErrorResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { message: "An unexpected error occurred during header validation" }
      );
    }
  };
}
