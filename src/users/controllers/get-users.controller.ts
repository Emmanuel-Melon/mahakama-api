import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/users.list";
import { userResponseSchema } from "../users.schema";

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await findAll();
    const validatedUsers = users.map((user) => userResponseSchema.parse(user));
    return res.status(200).json({
      success: true,
      data: validatedUsers,
    });
  } catch (error) {
    next(error);
  }
};
