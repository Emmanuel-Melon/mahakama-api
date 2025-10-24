import { Request, Response, NextFunction } from "express";
import { RegisterUserAttrs, LoginUserAttrs } from "./auth.schema";
import {
  generateAuthToken,
  hashPassword,
  comparePasswords,
  getCookieOptions,
} from "./utils";
import { registerUser } from "./operations/auth.create";
import { findUserByEmail } from "./operations/auth.find";
import { authQueue } from "./queue";
import { config } from "../config";

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserAttrs>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.validatedData;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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
    });

    // Set HTTP-only cookie with cross-origin support
    res.cookie("token", token, getCookieOptions());

    // CORS headers are now handled by the CORS middleware

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserAttrs>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    console.log("request", email, password);

    const user = await findUserByEmail(email);

    console.log("user", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAuthToken(user);

    // Set HTTP-only cookie with cross-origin support
    res.cookie("token", token, getCookieOptions());

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};
