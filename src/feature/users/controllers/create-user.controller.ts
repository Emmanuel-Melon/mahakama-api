import { Request, Response, NextFunction } from "express";
import { createUser as createUserOperation } from "../operations/users.create";
import type { NewUser, User } from "../users.types";
import { findById, findByFingerprint } from "../operations/users.find";
import { v4 as uuid } from "uuid";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { usersQueue } from "../workers/users.queue";
import { HttpStatus } from "@/http-status";
import { logger } from "@/lib/logger";
import { BaseJobPayload } from "@/lib/bullmq/bullmq.types";
import { SerializedUser, UserEvents } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";


export const createUserController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body ?? {} as NewUser;
  const userId = req.user?.id || "";

  const [userById, userByFingerprint] = await Promise.all([
    findById(userId),
    findByFingerprint(req.fingerprint.hash),
  ]);

  if (userById) {
    return sendErrorResponse(req, res, {
      status: HttpStatus.CONFLICT,
    });
  }

  const user = await createUserOperation({
    id: uuid(),
    name: name as string,
    email: email as string,
    fingerprint: req.fingerprint?.hash,
    userAgent: req.headers["user-agent"],
  });

  sendSuccessResponse(
    req,
    res,
    {
      data: {
        ...user,
      },
      serializerConfig: SerializedUser,
      type: "single",
    },
    {
      status: HttpStatus.SUCCESS,
    },
  );

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

    // try {
    //   await usersQueue.enqueue(UserEvents.UserCreated.jobName, jobPayload, {});
    // } catch (err) {
    //   logger.error(
    //     {
    //       err,
    //       jobType: UserEvents.UserCreated.jobName,
    //       userId: user.id,
    //       requestId: req.requestId,
    //       jobPayload,
    //     },
    //     "Failed to enqueue UserCreated job",
    //   );
    // }
  });
});