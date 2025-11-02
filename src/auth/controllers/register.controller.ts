import { Request, Response, NextFunction } from "express";
import { RegisterUserAttrs } from "../auth.schema";
import { generateAuthToken, hashPassword, getCookieOptions } from "../utils";
import { registerUser } from "../operations/auth.create";
import { findUserByEmail } from "../operations/auth.find";
import { authQueue, AuthJobType } from "../auth.queue";
import { RegisterResponse } from "../auth.types";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/response";
import { userResponseSchema } from "../../users/users.schema";

export const registerUserController = async (
  req: Request<{}, {}, RegisterUserAttrs>,
  res: Response<RegisterResponse>,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.validatedData;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return sendErrorResponse(res, "User already exists", 400, "USER_EXISTS");
    }

    const hashedPassword = await hashPassword(password);

    const user = await registerUser({
      email,
      password: hashedPassword,
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

    const { password: _, ...userWithoutPassword } = user;

    sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(userWithoutPassword) },
      201,
      {
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
