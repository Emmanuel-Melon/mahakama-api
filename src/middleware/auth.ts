import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@/config/dev.config";
import { findById } from "@/feature/users/operations/users.find";
import { logger } from "@/lib/logger";
import {
  sendErrorResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/express/http-status";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Format: "Bearer TOKEN"
  try {
    const verified = jwt.verify(token, config.jwtSecret) as JwtPayload;
    const user = await findById(verified.id);
    if (!user) {
      logger.warn({ userId: verified.id }, "User not found for valid token");
      return sendErrorResponse(res, HttpStatus.NOT_FOUND);
    }
    req.user = user;
    logger.debug({ userId: user.id, path: req.path }, "User authenticated");
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error(
      { error: errorMessage, path: req.path },
      "Token verification failed",
    );

    if (error instanceof jwt.JsonWebTokenError) {
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZED);
    }

    if (error instanceof jwt.TokenExpiredError) {
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZED);
    }

    return sendErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
