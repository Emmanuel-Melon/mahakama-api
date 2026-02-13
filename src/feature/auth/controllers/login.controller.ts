import { Request, Response } from "express";
import {
  generateAuthToken,
  getCookieOptions,
  comparePasswords,
} from "../auth.utils";
import { findUserByEmail } from "../operations/auth.find";
import { authQueue } from "../workers/auth.queue";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "@/feature/users/users.config";
import { AuthEvents } from "../auth.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const loginUserController = asyncHandler(async (req: Request, res: Response) => {
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
  sendSuccessResponse(req, res, {
    data: userWithoutPassword,
    serializerConfig: SerializedUser,
    type: "single",
  });
  res.on("finish", async () => {
    authQueue.enqueue(AuthEvents.Login.jobName, {
      user: userWithoutPassword,
    });
  });
});
