import { Request, Response, NextFunction } from "express";
import { RegisterUserAttrs, registerUserSchema } from "./auth.schema";
import { LoginUserAttrs, loginUserSchema } from "./auth.schema";

export const validateLoginUser = (
  req: Request<{}, {}, LoginUserAttrs>,
  res: Response,
  next: NextFunction,
) => {
  const result = loginUserSchema.safeParse(req.body);

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

export const validateRegisterUser = (
  req: Request<{}, {}, RegisterUserAttrs>,
  res: Response,
  next: NextFunction,
) => {
  const result = registerUserSchema.safeParse(req.body);

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
