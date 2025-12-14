import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/users.list";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";

export const getUsersController = async (
  req: Request,
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
        serializerConfig: SerializedUser,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total,
        },
      },
    );
  } catch (error) {
    next(error);
  }
};
