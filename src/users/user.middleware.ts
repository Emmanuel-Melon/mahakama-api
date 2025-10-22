import { Request, Response, NextFunction } from "express";
import { createUserSchema } from "./user.schema";
import { CreateUserRequest } from "./user.schema";
export const validateCreateUser = (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
  next: NextFunction,
) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.format();
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid input data",
      details: formattedErrors,
    });
  }
  req.validatedData = result.data;
  next();
};
