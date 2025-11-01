import { NextFunction, Response, Request } from "express";
import { z } from "zod";

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json(error.errors);
    }
  };
}