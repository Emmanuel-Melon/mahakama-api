import { Request, Response, NextFunction } from "express";
import { LoginUserAttrs } from "../auth.schema";
import {
  generateAuthToken,
  getCookieOptions,
  comparePasswords,
} from "../utils";
import { findUserByEmail } from "../operations/auth.find";
import { AuthResponse } from "../auth.types";
import { authQueue, AuthJobType } from "../queue";

export const loginUserController = async (
  req: Request<{}, {}, LoginUserAttrs>,
  res: Response<AuthResponse>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        data: {
          user: null,
          error: "Invalid credentials",
        },
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        data: {
          user: null,
          error: "Invalid credentials",
        },
      });
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        data: {
          user: null,
          error: "Invalid credentials",
        },
      });
    }

    const token = generateAuthToken(user);

    await authQueue.enqueue(AuthJobType.Login, {
      userId: user.id,
      email: user.email!,
      timestamp: Date.now(),
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    res.cookie("token", token, getCookieOptions());

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};
