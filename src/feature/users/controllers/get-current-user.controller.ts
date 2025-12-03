import { Request, Response, NextFunction } from "express";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/express/http-status";
import { UserSerializer } from "../users.config";
import { findById } from "../operations/users.find";

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await findById(req.user.id);
    if (!user) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
        message: "The requested user profile doesn't exist on this serve.",
      });
    }
    return sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...user,
        },
        serializerConfig: UserSerializer,
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
