import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/users.list";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { GetUsersQuery } from "../users.types";
import { HttpStatus } from "@/lib/express/http-status";
import { UserSerializer } from "../users.config";

export const getUsersController = async (
  req: Request<{}, {}, {}, GetUsersQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { users: data, total } = await findAll({ 
      ...req.query,
      limit: req.pagination.limit,
      page: req.pagination.page,
    });
    return sendSuccessResponse(
      req,
      res,
      {
        data: data,
        serializerConfig: UserSerializer,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total
        }
      },
    );
  } catch (error) {
    next(error);
  }
};
