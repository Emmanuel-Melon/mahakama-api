import { Request, Response, NextFunction } from "express";
import { LoginUserAttrs } from "../auth.schema";
import {
  generateAuthToken,
  getCookieOptions,
  comparePasswords,
} from "../auth.utils";
import { findUserByEmail } from "../operations/auth.find";
import { AuthResponse } from "../auth.types";
import { authQueue, AuthJobType } from "../workers/auth.queue";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/express.response";
import { userResponseSchema } from "../../users/users.schema";
import { HttpStatus } from "../../lib/express/http-status";

export const loginUserController = async (
  req: Request<{}, {}, LoginUserAttrs>,
  res: Response<AuthResponse>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body ?? {};
    const user = await findUserByEmail(email);
    if (!user) {
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZED, {
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZED, {
        message: "Account not properly set up. Please reset your password.",
      });
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZED, {
        message: "Invalid email or password",
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

    const { ...userWithoutPassword } = user;

    return sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(userWithoutPassword) },
      {
        requestId: req.requestId,
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error: unknown) {
    next(error);
  }
};
