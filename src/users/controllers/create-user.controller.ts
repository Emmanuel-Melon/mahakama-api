import { Request, Response, NextFunction } from "express";
import { createUser as createUserOperation } from "../operations/users.create";
import { userResponseSchema } from "../user.schema";
import { findById, findByFingerprint } from "../operations/users.find";
import { v4 as uuid } from "uuid";

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.fingerprint?.hash) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            "Could not identify user session. Please ensure cookies are enabled.",
          code: "MISSING_FINGERPRINT",
        },
      });
    }
    const { name, email } = req.validatedData;
    const userId = req.user?.id || req.fingerprint?.hash;

    const [userById, userByFingerprint] = await Promise.all([
      findById(userId),
      findByFingerprint(req.fingerprint.hash),
    ]);

    if (userById || userByFingerprint) {
      return res.status(409).json({
        success: false,
        data: "User already exists",
      });
    }

    const newUser = await createUserOperation({
      id: uuid(),
      name: name as string,
      email: email as string,
      fingerprint: req.fingerprint?.hash,
      userAgent: req.headers["user-agent"],
    });
    return res.status(201).json({
      success: true,
      data: userResponseSchema.parse(newUser),
    });
  } catch (error) {
    next(error);
  }
};
