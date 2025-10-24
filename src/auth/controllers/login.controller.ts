import { Request, Response, NextFunction } from "express";
import { LoginUserAttrs } from "../auth.schema";
import { generateAuthToken, getCookieOptions } from "../utils";
import { findUserByEmail } from "../operations/auth.find";

export const loginUserController = async (
  req: Request<{}, {}, LoginUserAttrs>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

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