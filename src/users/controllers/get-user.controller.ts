import { Request, Response, NextFunction } from "express";
import { findById } from "../operations/users.find";
import { userResponseSchema } from "../user.schema";

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const user = await findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const validatedUser = userResponseSchema.parse(user);
    return res.status(200).json({
      success: true,
      data: validatedUser,
    });
  } catch (error) {
    next(error);
  }
};
