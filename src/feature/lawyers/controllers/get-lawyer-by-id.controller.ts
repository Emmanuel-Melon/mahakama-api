import { Request, Response, NextFunction } from "express";
import { findById } from "../operations/lawyers.find";
import { lawyerResponseSchema } from "../lawyers.schema";
import { NotFoundError } from "@/middleware/errors";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/express/http-status";

export const getLawyerByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lawyerId = parseInt(req.params.id);
    const lawyer = await findById(lawyerId);
    if (!lawyer) {
      throw new NotFoundError("Lawyer", { id: lawyerId });
    }
    sendSuccessResponse(
      res,
      { lawyer: lawyerResponseSchema.parse(lawyer) },
      {
        status: HttpStatus.SUCCESS,
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
