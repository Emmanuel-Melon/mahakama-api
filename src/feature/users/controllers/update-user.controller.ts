import { Request, Response, NextFunction } from "express";
import { updateUser } from "../operations/users.update";
import {
  userResponseSchema,
  User,

} from "../users.schema";
import { findById } from "../operations/users.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/express.response";
import { type SuccessResponse } from "../../lib/express/express.types";
import { GetUsersParams,   UserAttrs,
  UserRoles, } from "../users.types";
import { HttpStatus } from "../../lib/express/http-status";

export const updateUserController = async (
  req: Request<GetUsersParams, {}, Omit<UserAttrs, "password">, {}>,
  res: Response<SuccessResponse<User>>,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return sendErrorResponse(res, HttpStatus.BAD_REQUEST);
    }

    const existingUser = await findById(userId);
    if (!existingUser) {
      return sendErrorResponse(res, HttpStatus.NOT_FOUND);
    }

    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return sendErrorResponse(res, HttpStatus.FORBIDDEN);
    }

    const updateData = req.body;

    const updatedUser = await updateUser(userId, {
      ...updateData,
      role: updateData.role as UserRoles,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(updatedUser) },
      {
        status: HttpStatus.SUCCESS,
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};


