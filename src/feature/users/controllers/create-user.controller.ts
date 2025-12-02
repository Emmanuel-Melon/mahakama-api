import { Request, Response, NextFunction } from "express";
import { createUser as createUserOperation } from "../operations/users.create";
import { UserAttrs, userResponseSchema, User } from "../users.schema";
import { findById, findByFingerprint } from "../operations/users.find";
import { v4 as uuid } from "uuid";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/express.response";
import { usersQueue, UsersJobType } from "../workers/users.queue";
import { HttpStatus } from "../../lib/express/http-status";
import { logger } from "../../lib/logger";
import { BaseJobPayload } from "../../lib/bullmq/types";

export const createUserController = async (
  req: Request<{}, {}, UserAttrs>,
  res: Response<any>,
  next: NextFunction,
) => {
  try {
    if (!req.fingerprint?.hash) {
      return sendErrorResponse(res, HttpStatus.BAD_REQUEST);
    }
    const { name, email } = req.body ?? {};
    const userId = req.user?.id || req.fingerprint?.hash;

    const [userById, userByFingerprint] = await Promise.all([
      findById(userId),
      findByFingerprint(req.fingerprint.hash),
    ]);

    if (userById || userByFingerprint) {
      return sendErrorResponse(res, HttpStatus.CONFLICT);
    }

    const user = await createUserOperation({
      id: uuid(),
      name: name as string,
      email: email as string,
      fingerprint: req.fingerprint?.hash,
      userAgent: req.headers["user-agent"],
    });

    sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(user) },
      {
        status: HttpStatus.CREATED,
        requestId: req.requestId,
      },
    );

    // After response is sent — async fire
    res.on("finish", async () => {
      const jobPayload: BaseJobPayload<{ user: User }> = {
        eventId: uuid(),
        timestamp: new Date().toISOString(),
        actor: req.user?.id || "system",
        payload: { user },
        metadata: {
          source: "api",
          requestId: req.requestId,
          userAgent: req.headers["user-agent"],
          ip: req.ip,
        },
      };

      try {
        await usersQueue.enqueue(UsersJobType.UserCreated, jobPayload);
      } catch (err) {
        logger.error(
          {
            err,
            jobType: UsersJobType.UserCreated,
            userId: user.id,
            requestId: req.requestId,
            jobPayload,
          },
          "Failed to enqueue UserCreated job",
        );
      }
    });
  } catch (error) {
    next(error);
  }
};
