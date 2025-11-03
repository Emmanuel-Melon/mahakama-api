import { Request, Response, NextFunction } from "express";
import { RegisterUserAttrs } from "../auth.schema";
import { generateAuthToken, hashPassword, getCookieOptions } from "../utils";
import { registerUser } from "../operations/auth.create";
import { findUserByEmail } from "../operations/auth.find";
import { authQueue, AuthJobType } from "../workers/auth.queue";
import { RegisterResponse } from "../auth.types";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/response";
import { userResponseSchema } from "../../users/users.schema";
import { HttpStatus } from "../../lib/express/http-status";

export const registerUserController = async (
  req: Request<{}, {}, RegisterUserAttrs>,
  res: Response<RegisterResponse>,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.body ?? {};
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return sendErrorResponse(res, HttpStatus.CONFLICT, {
        message: "User with this email already exists",
      });
    }

    const user = await registerUser({
      email,
      password,
      name,
    });

    const token = generateAuthToken(user);

    await authQueue.enqueue(AuthJobType.Registration, {
      userId: user.id,
      email,
      name,
      password,
      timestamp: Date.now(),
      userAgent: req.headers["user-agent"],
    });

    res.cookie("token", token, getCookieOptions());

    const { ...userWithoutPassword } = user;

    return sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(userWithoutPassword) },
      {
        requestId: req.requestId,
        status: HttpStatus.CREATED,
      },
    );
  } catch (error) {
    next(error);
  }
};
