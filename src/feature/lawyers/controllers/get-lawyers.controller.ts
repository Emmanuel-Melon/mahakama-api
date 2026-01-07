import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/lawyers.list";

import { HttpStatus } from "@/http-status";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { LawyersSerializer } from "../lawyers.config";

export const getLawyersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { specialization, location, available, q } = req.query;
    const result = await findAll({
      specialization: specialization as string,
      location: location as string,
      isAvailable: available === "true",
      q: q as string,
    });
    return sendSuccessResponse(
      req,
      res,
      {
        data: result.map((lawyer) => ({
          ...lawyer,
          id: lawyer.id.toString(),
        })) as ((typeof result)[number] & { id: string })[],
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
