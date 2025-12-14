import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/lawyers.list";
import { lawyersListResponseSchema } from "../lawyers.schema";

import { HttpStatus } from "@/http-status";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { LawyersSerializer } from "../lawyers.config";

export const getLawyersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await findAll();
    return sendSuccessResponse(
      req,
      res,
      {
        data: result.map(lawyer => ({ ...lawyer, id: lawyer.id.toString() })) as (typeof result[number] & { id: string })[],
        type: "collection",
        serializerConfig: LawyersSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    next(error);
  }
};
