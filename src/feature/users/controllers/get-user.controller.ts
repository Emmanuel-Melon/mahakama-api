import { Request, Response, NextFunction } from "express";
import { findById } from "../operations/users.find";
import { userResponseSchema } from "../users.schema";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../lib/express/express.response";
import { GetUsersParams } from "../users.types";
import { HttpStatus } from "../../lib/express/http-status";
import { SuccessResponse } from "../../lib/express/express.types";
import { UserResponse } from "../users.types";

export const getUserController = async (
  req: Request<GetUsersParams, {}, {}, {}>,
  res: Response<SuccessResponse<UserResponse>>,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return sendErrorResponse(res, HttpStatus.BAD_REQUEST);
    }
    const user = await findById(userId);
    if (!user) {
      return sendErrorResponse(res, HttpStatus.BAD_REQUEST);
    }
    return sendSuccessResponse(
      res,
      { user: userResponseSchema.parse(user) },
      {
        status: HttpStatus.SUCCESS,
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
