import { Request, Response, NextFunction } from "express";
import { findById } from "../operations/find";
import { userResponseSchema } from "../user.schema";
import { NotFoundError } from "@/middleware/errors";

export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await findById(userId);

    if (!user) {
      throw new NotFoundError("User", { id: userId });
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
