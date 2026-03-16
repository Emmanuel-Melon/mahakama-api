import { Request, Response } from "express";
import { createUser as createUserOperation } from "../operations/users.create";
import type { NewUser, User } from "../users.types";
import { findUserById } from "../operations/users.find";
import { v4 as uuid } from "uuid";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { usersQueue } from "../workers/users.queue";
import { HttpStatus } from "@/http-status";
import { BaseJobPayload } from "@/lib/bullmq/bullmq.types";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { UserEvents } from "../users.config";
import { logger } from "@/lib/logger";

export const createUserController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body ?? {} as NewUser;
  const userId = req.user?.id || "";

  const userById = unwrap(await findUserById(userId),
    new HttpError(HttpStatus.NOT_FOUND, "User not found"));

  if (userById) {
    sendErrorResponse(req, res, {
      status: HttpStatus.CONFLICT,
    });

    return new HttpError(HttpStatus.NOT_FOUND, "User already exists");
  }

  const user = unwrap(await createUserOperation({
    id: uuid(),
    name: name as string,
    email: email as string,
    fingerprint: req.fingerprint?.hash,
    userAgent: req.headers["user-agent"],
  }), new HttpError(HttpStatus.BAD_REQUEST, "Failed to create user"));

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

  const userJobPayload: BaseJobPayload<{ user: User }> = {
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
  //   await usersQueue.enqueue(UserEvents.UserCreated.jobName, userJobPayload, {});
  // } catch (err) {
  //   logger.error(
  //     {
  //       err,
  //       jobType: UserEvents.UserCreated.jobName,
  //       userId: user.id,
  //       requestId: req.requestId,
  //       userJobPayload,
  //     },
  //     "Failed to enqueue UserCreated job",
  //   );
  // }
});
