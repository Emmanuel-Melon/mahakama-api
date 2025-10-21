import { Request, Response, NextFunction } from "express";
import { createUser as createUserOperation } from "../operations/create";
import { userResponseSchema } from "../user.schema";

export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, role, password } = req.body;

    const newUser = await createUserOperation({
      name,
      email,
      role,
      password,
    });

    const validatedUser = userResponseSchema.parse(newUser);
    return res.status(201).json({
      success: true,
      data: validatedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    next(error);
  }
};
