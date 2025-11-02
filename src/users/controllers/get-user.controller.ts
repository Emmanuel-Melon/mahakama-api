import { Request, Response, NextFunction } from "express";
import { findById } from "../operations/users.find";
import { userResponseSchema } from "../users.schema";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/response";

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return sendErrorResponse(
        res,
        "User ID is required",
        400,
        "INVALID REQUEST",
      );
    }

    const user = await findById(userId);
    if (!user) {
      return sendErrorResponse(res, "User Not Found", 404, "INVALID REQUEST");
    }

    return sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(user) },
      200,
      {
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
