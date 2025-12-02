import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/users.list";
import { userResponseSchema } from "../users.schema";
import { sendSuccessResponse } from "../../lib/express/express.response";
import { GetUsersQuery } from "../users.types";
import { type SuccessResponse, type PaginationResult } from "../../lib/express/express.types";
import { HttpStatus } from "../../lib/express/http-status";

type UsersResponse = PaginationResult<Array<ReturnType<typeof userResponseSchema.parse>>>;

export const getUsersController = async (
  req: Request<{}, {}, {}, GetUsersQuery>,
  res: Response<SuccessResponse<UsersResponse>>,
  next: NextFunction,
) => {
  try {
    const { users, total } = await findAll({ 
      ...req.query,
      limit: req.pagination.limit,
      page: req.pagination.page,
    });
    
    const pages = Math.ceil(total / req.pagination.limit);
    
    const validatedUsers = users.map((user) => userResponseSchema.parse(user));
    
    return sendSuccessResponse(
      res,
      { 
        data: validatedUsers,
        pagination: {
          page: req.pagination.page,
          limit: req.pagination.limit,
          total,
          pages,
        }
      },
      {
        status: HttpStatus.SUCCESS,
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
