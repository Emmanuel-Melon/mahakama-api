import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { findById } from "../users/operations/users.find";
import { logger } from "../lib/logger";

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
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    if (!config.jwtSecret) {
      logger.error("JWT secret not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const verified = jwt.verify(token, config.jwtSecret) as JwtPayload;

    if (typeof verified === "string" || !("id" in verified)) {
      logger.warn({ path: req.path }, "Invalid token format");
      return res.status(401).json({
        success: false,
        error: "Invalid token format",
      });
    }

    const user = await findById(verified.id);
    if (!user) {
      logger.warn({ userId: verified.id }, "User not found for valid token");
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
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
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: "Token expired",
      });
    }

    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};
