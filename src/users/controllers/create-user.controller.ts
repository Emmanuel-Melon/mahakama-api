import { Request, Response, NextFunction } from "express";
import { createUser as createUserOperation } from "../operations/users.create";
import { userResponseSchema } from "../user.schema";

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, role, password } = req.validatedData;
    const newUser = await createUserOperation({
      name,
      email,
      role,
      password,
      isAnonymous: true,
    });
    return res.status(201).json({
      success: true,
      data: userResponseSchema.parse(newUser),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    next(error);
  }
};
