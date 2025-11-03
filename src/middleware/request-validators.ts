import { NextFunction, Response, Request } from "express";
import { z, ZodTypeAny } from "zod";
import { sendErrorResponse } from "../lib/express/response";
import { TypedRequestParams, TypedRequestQuery } from "../lib/express/types";
import {
  internalServerError,
  requestValidationError,
} from "../lib/express/http-codes";

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const formattedErrors = result.error.format();
        const requestId = (req as any).id || "unknown";

        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: formattedErrors,
            requestId,
          },
        });

        // return sendErrorResponse(
        //   res,
        //   "Invalid request data",
        //   400,
        //   "VALIDATION_ERROR",
        // );
      }
      req.body = result.data;
      next();
    } catch (error) {
      return sendErrorResponse(
        res,
        "An unexpected error occurred during validation",
        500,
        "INTERNAL_SERVER_ERROR",
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
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_PARAMS",
          message: "Invalid URL parameters",
          details: error.errors,
        },
      });
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
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_QUERY",
          message: "Invalid query parameters",
          details: error.errors,
        },
      });
    }
  };
}
