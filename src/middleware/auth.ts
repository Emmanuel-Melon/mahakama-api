import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { findById } from "../users/operations/users.find";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("authHeader", req.headers);
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  console.log("Auth Header:", authHeader);
  console.log("Extracted Token:", token);

  // Attach the token to the request object for use in route handlers
  if (token) {
    req.token = token;

    try {
      // Decode the token without verifying the signature
      const decoded = jwt.decode(token);
      console.log("Decoded Token:", JSON.stringify(decoded, null, 2));

      // If you want to verify the token (recommended in production)
      if (config.jwtSecret) {
        const verified = jwt.verify(token, config.jwtSecret) as JwtPayload;
        console.log(
          "Verified Token Payload:",
          JSON.stringify(verified, null, 2),
        );
        
        if (typeof verified === 'string' || !('id' in verified)) {
          return res.status(401).json({ error: 'Invalid token format' });
        }
        
        const user = await findById(verified.id);
        console.log("my userssssss", user);
        req.user = user;
      } else {
        console.warn("JWT_SECRET not set, skipping token verification");
      }
    } catch (error) {
      console.error(
        "Error decoding/verifying token:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  } else {
    console.log("No token provided in Authorization header");
  }

  // Continue to the next middleware/route handler
  next();
};

// For routes that require authentication
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.token) {
    console.log("Authentication required - no token provided");
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Token is present, continue to the next middleware/route handler
  next();
};
