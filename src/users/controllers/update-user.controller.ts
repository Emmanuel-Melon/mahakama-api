import { Request, Response, NextFunction } from "express";
import { updateUser } from "../operations/users.update";
import { userResponseSchema } from "../users.schema";
import { findById } from "../operations/users.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/response";

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return sendErrorResponse(
        res,
        "User ID is required",
        400,
        "USER_ID_REQUIRED",
      );
    }

    const existingUser = await findById(userId);
    if (!existingUser) {
      return sendErrorResponse(res, "User not found", 400, "USER_NOT_FOUND");
    }

    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return sendErrorResponse(
        res,
        "You don't have permission to update this user",
        403,
        "FORBIDDEN",
      );
    }

    const updateData = req.body;

    const updatedUser = await updateUser(userId, {
      ...updateData,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(updatedUser) },
      200,
      {
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
