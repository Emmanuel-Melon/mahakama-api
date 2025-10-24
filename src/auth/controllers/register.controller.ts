import { Request, Response, NextFunction } from "express";
import { RegisterUserAttrs } from "../auth.schema";
import { generateAuthToken, hashPassword, getCookieOptions } from "../utils";
import { registerUser } from "../operations/auth.create";
import { findUserByEmail } from "../operations/auth.find";
import { authQueue } from "../queue";

export const registerUserController = async (
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
