import { Request, Response, NextFunction } from "express";
import { RegisterUserInput, LoginUserInput } from "./auth.schema";
import { generateAuthToken, hashPassword } from "./utils";

import { createUser } from "./operations/create";
import { findUserByEmail } from "./operations/find";

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
      email,
      password: hashedPassword,
      role: "user",
      isAnonymous: false,
      name,
    });

    const token = generateAuthToken(user);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: generateAuthToken(user),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};
