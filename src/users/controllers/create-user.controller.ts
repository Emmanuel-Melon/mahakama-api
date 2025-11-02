import { Request, Response, NextFunction } from "express";
import { createUser as createUserOperation } from "../operations/users.create";
import { UserAttrs, userResponseSchema, User } from "../users.schema";
import { findById, findByFingerprint } from "../operations/users.find";
import { v4 as uuid } from "uuid";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/response";
import { usersQueue, UsersJobType } from "../users.queue";

export const createUserController = async (
  req: Request<{}, {}, UserAttrs>,
  res: Response<any>,
  next: NextFunction,
) => {
  try {
    if (!req.fingerprint?.hash) {
      return sendErrorResponse(
        res,
        "Could not identify user session. Please ensure cookies are enabled.",
        400,
        "MISSING_FINGERPRINT",
      );
    }
    const { name, email } = req.validatedData;
    const userId = req.user?.id || req.fingerprint?.hash;

    const [userById, userByFingerprint] = await Promise.all([
      findById(userId),
      findByFingerprint(req.fingerprint.hash),
    ]);

    if (userById || userByFingerprint) {
      res.status(409).json({
        success: false,
        data: "User already exists",
      });
      return sendErrorResponse(res, "User already exists", 409, "USER_EXISTS");
    }

    const user = await createUserOperation({
      id: uuid(),
      name: name as string,
      email: email as string,
      fingerprint: req.fingerprint?.hash,
      userAgent: req.headers["user-agent"],
    });

    await usersQueue.enqueue(UsersJobType.UserCreatd, {
      ...user,
    });

    return sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(user) },
      201,
      {
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
