import { Request, Response } from "express";
import { findById } from "../operations/users.find";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedUser } from "../users.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getUserController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await findById(userId);
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
});
