import { NextFunction, Response, Request } from "express";
import { z, ZodTypeAny } from "zod";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const formattedErrors = result.error.format();
        const requestId = (req as any).id || "unknown";

        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: formattedErrors,
            requestId,
          },
        });
      }
      req.body = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred during validation",
        },
      });
    }
  };
}

type TypedRequestParams<T extends ZodTypeAny> = Omit<Request, "params"> & {
  params: z.infer<T> & ParamsDictionary;
};

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

type TypedRequestQuery<T extends ZodTypeAny> = Omit<Request, "query"> & {
  query: z.infer<T> & ParsedQs;
};

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
