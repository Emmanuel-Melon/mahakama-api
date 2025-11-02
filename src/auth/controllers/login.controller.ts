import { Request, Response, NextFunction } from "express";
import { LoginUserAttrs } from "../auth.schema";
import {
  generateAuthToken,
  getCookieOptions,
  comparePasswords,
} from "../utils";
import { findUserByEmail } from "../operations/auth.find";
import { AuthResponse } from "../auth.types";
import { authQueue, AuthJobType } from "../auth.queue";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/response";
import { userResponseSchema } from "../../users/users.schema";

export const loginUserController = async (
  req: Request<{}, {}, LoginUserAttrs>,
  res: Response<AuthResponse>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return sendErrorResponse(
        res,
        "Invalid credentials",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    if (!user.password) {
      return sendErrorResponse(
        res,
        "Invalid credentials",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(
        res,
        "Invalid credentials",
        401,
        "INVALID_CREDENTIALS",
      );
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

    return sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(userWithoutPassword) },
      200,
      {
        requestId: req.requestId,
      },
    );
  } catch (error: unknown) {
    next(error);
  }
};
