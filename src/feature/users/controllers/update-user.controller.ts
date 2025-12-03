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
} from "@/lib/express/express.response";
import { type SuccessResponse } from "@/lib/express/express.types";
import { GetUsersParams,   UserAttrs,
  UserRoles, } from "../users.types";
import { HttpStatus } from "@/lib/express/http-status";
import { UserSerializer } from "../users.config";

export const updateUserController = async (
  req: Request<GetUsersParams, {}, Omit<UserAttrs, "password">, {}>,
  res: Response<SuccessResponse<User>>,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    const existingUser = await findById(userId);
    if (!existingUser) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
        message: "The requested user profile doesn't exist on this serve.",
      });
    }
    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return sendErrorResponse(req, res, {
        status: HttpStatus.FORBIDDEN
      });
    }
    const data = await updateUser(userId, {
      ...req.body,
      role: req.body.role as UserRoles,
    });
    if (!data) {
      throw new Error("Failed to update user");
    }
    return sendSuccessResponse(
      req,
      res,
      {
        data: data,
        serializerConfig: UserSerializer,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    next(error);
  }
};


