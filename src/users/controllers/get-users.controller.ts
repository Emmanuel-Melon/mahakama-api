import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/users.list";
import { userResponseSchema, User } from "../users.schema";
import { sendSuccessResponse } from "../../lib/express/response";
import { GetUsersQuery } from "../users.types";
import { type SuccessResponse } from "../../lib/express/types";
import { HttpStatus } from "../../lib/express/http-status";

export const getUsersController = async (
  req: Request<{}, {}, {}, GetUsersQuery>,
  res: Response<SuccessResponse<User>>,
  next: NextFunction,
) => {
  try {
    // const { limit, page, sortBy, offset, search, order, total } = req.query;
    const users = await findAll();
    const validatedUsers = users.map((user) => userResponseSchema.parse(user));
    return sendSuccessResponse(
      res,
      { users: validatedUsers },
      {
        status: HttpStatus.SUCCESS,
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
