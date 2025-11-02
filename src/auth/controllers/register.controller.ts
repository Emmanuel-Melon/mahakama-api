import { Request, Response, NextFunction } from "express";
import { RegisterUserAttrs } from "../auth.schema";
import { generateAuthToken, hashPassword, getCookieOptions } from "../utils";
import { registerUser } from "../operations/auth.create";
import { findUserByEmail } from "../operations/auth.find";
import { authQueue } from "../queue";
import { RegisterResponse } from "../auth.types";

export const registerUserController = async (
  req: Request<{}, {}, RegisterUserAttrs>,
  res: Response<RegisterResponse>,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.validatedData;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: {
          user: null,
          error: "User already exists",
        },
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await registerUser({
      email,
      password: hashedPassword,
      name,
    });

    const token = generateAuthToken(user);

    await authQueue.enqueue("registration", {
      userId: user.id,
      email,
      name,
      password,
      timestamp: Date.now(),
      userAgent: req.headers["user-agent"],
    });

    res.cookie("token", token, getCookieOptions());

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};
