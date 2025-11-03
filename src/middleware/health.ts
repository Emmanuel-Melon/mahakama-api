import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../lib/express/response";

export const healthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return sendSuccessResponse(
    res,
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Mahakama API",
      version: process.env.npm_package_version || "1.0.0",
    },
    200,
    {
      requestId: req.requestId,
    },
  );
};
