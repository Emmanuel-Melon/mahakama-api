import { NextFunction, Response, Request } from "express";
import { z, ZodTypeAny } from "zod";
import { sendErrorResponse } from "@/lib/express/express.response";
import { TypedRequestParams, TypedRequestQuery } from "@/lib/express/express.types";
import { HttpStatus } from "@/lib/express/http-status";

export function validate<T extends z.ZodTypeAny>(schema: T) {
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

export function validateParams<T extends z.ZodTypeAny>(schema: T) {
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

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
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
