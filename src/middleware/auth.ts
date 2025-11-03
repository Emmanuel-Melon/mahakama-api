import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { findById } from "../users/operations/users.find";
import { logger } from "../lib/logger";
import { sendErrorResponse } from "../lib/express/response";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) {
    logger.warn(
      { path: req.path },
      "Authentication required - No token provided",
    );
    return sendErrorResponse(
      res,
      "Authentication required",
      401,
      "MISSING_AUTH",
    );
  }

  try {
    if (!config.jwtSecret) {
      logger.error("JWT secret not configured");
      return sendErrorResponse(
        res,
        "Server configuration error",
        500,
        "SERVER ERROR",
      );
    }

    const verified = jwt.verify(token, config.jwtSecret) as JwtPayload;

    if (typeof verified === "string" || !("id" in verified)) {
      logger.warn({ path: req.path }, "Invalid token format");
      return sendErrorResponse(
        res,
        "Authentication required",
        401,
        "MISSING_AUTH",
      );
    }

    const user = await findById(verified.id);
    if (!user) {
      logger.warn({ userId: verified.id }, "User not found for valid token");
      return sendErrorResponse(res, "User Not Found", 404, "MISSING_USER");
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
      return sendErrorResponse(
        res,
        "Authentication required",
        401,
        "MISSING_AUTH",
      );
    }

    if (error instanceof jwt.TokenExpiredError) {
      return sendErrorResponse(
        res,
        "Authentication required",
        401,
        "MISSING_AUTH",
      );
    }

    return sendErrorResponse(
      res,
      "Server configuration error",
      500,
      "SERVER ERROR",
    );
  }
};
