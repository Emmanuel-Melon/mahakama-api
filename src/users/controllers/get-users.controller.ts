import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/users.list";
import { userResponseSchema } from "../users.schema";
import { sendSuccessResponse } from "../../lib/express/response";

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await findAll();
    const validatedUsers = users.map((user) => userResponseSchema.parse(user));
    return sendSuccessResponse(res, { users: validatedUsers }, 200, {
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
};
