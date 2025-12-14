import { Request, Response, NextFunction } from "express";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { findById } from "../operations/users.find";

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await findById(req?.user?.id || "");
    if (!user) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
        description: "The requested user profile doesn't exist on this serve.",
      });
    }
    return sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...user,
        },
        serializerConfig: SerializedUser,
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
