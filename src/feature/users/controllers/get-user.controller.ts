import { Request, Response, NextFunction } from "express";
import { findById } from "../operations/users.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { GetUsersParams } from "../users.types";
import { HttpStatus } from "@/lib/express/http-status";
import { SuccessResponse } from "@/lib/express/express.types";
import { UserResponse } from "../users.types";
import { UserSerializer } from "../users.config";

export const getUserController = async (
  req: Request<GetUsersParams, {}, {}, {}>,
  res: Response<SuccessResponse<UserResponse>>,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    const user = await findById(userId);
    if (!user) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
        message: "The requested user profile doesn't exist on this serve.",
      });
    }
    return sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...user,
        },
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
