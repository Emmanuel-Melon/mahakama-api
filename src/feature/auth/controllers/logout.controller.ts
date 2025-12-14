import { Request, Response, NextFunction } from "express";
import { logoutUser } from "../operations/auth.logout";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { clearAuthCookie } from "../auth.utils";

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!userId || !token) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized",
      });
    }

    await logoutUser({
      userId,
      token,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    clearAuthCookie(res);
    res.status(HttpStatus.SUCCESS.statusCode).json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    next(error);
  }
};
