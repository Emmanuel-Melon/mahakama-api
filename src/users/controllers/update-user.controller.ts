import { Request, Response, NextFunction } from "express";
import { updateUser } from "../operations/users.update";
import { userResponseSchema } from "../users.schema";
import { findById } from "../operations/users.find";

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: {
          message: "User ID is required",
          code: "USER_ID_REQUIRED",
        },
      });
    }

    const existingUser = await findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: {
          message: "User not found",
          code: "USER_NOT_FOUND",
        },
      });
    }

    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: {
          message: "You don't have permission to update this user",
          code: "FORBIDDEN",
        },
      });
    }

    const updateData = req.body;

    const updatedUser = await updateUser(userId, {
      ...updateData,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return res.status(200).json({
      success: true,
      data: userResponseSchema.parse(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};
