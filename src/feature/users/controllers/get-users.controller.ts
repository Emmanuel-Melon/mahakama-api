import { Request, Response } from "express";
import { findAll } from "../operations/users.list";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getUsersController = asyncHandler(async (req: Request, res: Response) => {
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
});
