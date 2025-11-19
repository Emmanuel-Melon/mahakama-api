import { Request, Response, NextFunction } from "express";
import { logoutUser } from "../operations/auth.logout";
import { sendErrorResponse, sendSuccessResponse } from "../../lib/express/express.response";
import { HttpStatus } from "../../lib/express/http-status";
import { clearAuthCookie } from "../auth.utils";

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!userId || !token) {
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZED);
    }

    await logoutUser({
      userId,
      token,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    clearAuthCookie(res);

    return sendSuccessResponse(
      res,
      { success: true, message: "Successfully logged out" },
      {
        requestId: req.requestId,
        status: HttpStatus.SUCCESS,
      }
    );
  } catch (error) {
    next(error);
  }
};