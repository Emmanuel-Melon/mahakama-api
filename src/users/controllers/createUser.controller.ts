import { Request, Response } from "express";
import { createUser as createUserOperation } from "../operations/create";
import { userResponseSchema } from "../user.schema";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;

    const newUser = await createUserOperation({
      name,
      email,
      role,
    });

    const validatedUser = userResponseSchema.parse(newUser);
    return res.status(201).json(validatedUser);
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof Error && error.message.includes("duplicate")) {
      return res.status(409).json({
        error: "Email already exists",
        message: "A user with this email already exists",
      });
    }

    return res.status(500).json({
      error: "Failed to create user",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
