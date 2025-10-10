import { NextFunction, Request, Response } from "express";

export const healthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Mahakama API",
    version: process.env.npm_package_version || "1.0.0",
  });
};