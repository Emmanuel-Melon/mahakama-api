import { Request, Response } from "express";
import { updateUser } from "../operations/users.update";
import { type UserRole } from "../users.schema";
import  type { User, NewUser } from "../users.types";
import { findById } from "../operations/users.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const updateUserController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const existingUser = await findById(userId);
  if (!existingUser) {
    return sendErrorResponse(req, res, {
      status: HttpStatus.NOT_FOUND,
      description: "The requested user profile doesn't exist on this serve.",
    });
  }
  if (req.user?.id !== userId && req.user?.role !== "admin") {
    return sendErrorResponse(req, res, {
      status: HttpStatus.FORBIDDEN,
    });
  }
  const data = await updateUser(userId, {
    ...req.body,
    role: req.body.role as UserRole,
  });
  if (!data) {
    throw new Error("Failed to update user");
  }
  return sendSuccessResponse(
    req,
    res,
    {
      data: data,
      serializerConfig: SerializedUser,
      type: "single",
    },
    {
      status: HttpStatus.SUCCESS,
    },
  );
});
