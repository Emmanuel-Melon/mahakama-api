import { Request, Response } from "express";
import { RegisterUserAttrs } from "../auth.schema";
import {
  generateAuthToken,
  hashPassword,
  getCookieOptions,
} from "../auth.utils";
import { registerUser } from "../operations/auth.create";
import { findUserByEmail } from "../operations/auth.find";
// import { authQueue } from "../workers/auth.queue";
import { RegisterResponse } from "../auth.types";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "@/feature/users/users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const registerUserController = asyncHandler(async (req: Request<{}, {}, RegisterUserAttrs>, res: Response<RegisterResponse>) => {
  const { email, password, name } = req.body ?? {};
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return sendErrorResponse(req, res, {
      status: HttpStatus.CONFLICT,
      description: "User with this email already exists",
    });
  }

  const user = await registerUser({
    email,
    password,
    name,
  });

  const token = generateAuthToken(user);

  // await authQueue.enqueue(AuthJobType.Registration, {
  //   userId: user.id,
  //   email,
  //   name,
  //   password,
  //   timestamp: Date.now(),
  //   userAgent: req.headers["user-agent"],
  // });

  res.cookie("token", token, getCookieOptions());

  const { ...userWithoutPassword } = user;

  return sendSuccessResponse(req, res, {
    data: userWithoutPassword,
    serializerConfig: SerializedUser,
    type: "single",
  });
});
