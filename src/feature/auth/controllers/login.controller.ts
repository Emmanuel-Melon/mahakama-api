import { Request, Response, NextFunction } from "express";
import { LoginUserAttrs } from "../auth.schema";
import {
  generateAuthToken,
  getCookieOptions,
  comparePasswords,
} from "../auth.utils";
import { findUserByEmail } from "../operations/auth.find";
import { AuthResponse } from "../auth.types";
import { authQueue } from "../workers/auth.queue";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { userResponseSchema } from "@/feature/users/users.schema";
import { HttpStatus } from "@/http-status";
import { type AuthJobType, AuthEvents } from "../auth.config";
import { SerializedUser } from "@/feature/users/users.config";

export const loginUserController = async (
  req: Request<{}, {}, LoginUserAttrs>,
  res: Response<AuthResponse>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body ?? {};
    const user = await findUserByEmail(email);
    if (!user) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description: "Invalid email or password",
      });
    }

    if (!user.password) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description: "Account not properly set up. Please reset your password.",
      });
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description: "Invalid email or password",
      });
    }

    const token = generateAuthToken(user);
    res.cookie("token", token, getCookieOptions());

    const { ...userWithoutPassword } = user;

    return sendSuccessResponse(req, res, {
      data: userWithoutPassword,
      serializerConfig: SerializedUser,
      type: "single",
    });
  } catch (error: unknown) {
    next(error);
  }
};
