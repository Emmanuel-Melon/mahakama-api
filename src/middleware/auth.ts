import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "@/config";
import { findById } from "@/feature/users/operations/users.find";
import { logger } from "@/lib/logger";
import { sendErrorResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Format: "Bearer TOKEN"
  if (!token) {
    sendErrorResponse(req, res, {
      status: HttpStatus.UNAUTHORIZED,
      description: "Authentication Error",
    });
  }
  try {
    const verified = jwt.verify(token!, serverConfig.jwtSecret!) as JwtPayload;
    const user = await findById(verified.id);
    if (!user) {
      sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
        description: "User not found for valid token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error(
      { error: errorMessage, path: req.path },
      "Token verification failed",
    );

    if (error instanceof jwt.JsonWebTokenError) {
      sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description:
          error instanceof Error ? error.message : "Authentication Error",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description:
          error instanceof Error ? error.message : "Authentication Error",
      });
    }
    return sendErrorResponse(req, res, {
      status: HttpStatus.FORBIDDEN,
      description:
        error instanceof Error ? error.message : "Authentication Error",
    });
  }
};
