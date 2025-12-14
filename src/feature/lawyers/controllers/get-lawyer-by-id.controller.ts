import { Request, Response, NextFunction } from "express";
import { findById } from "../operations/lawyers.find";
import { lawyerResponseSchema } from "../lawyers.schema";
import { AppError } from "@/middleware/errors";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { LawyersSerializer } from "../lawyers.config";

export const getLawyerByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lawyerId = parseInt(req.params.id);
    const lawyer = await findById(lawyerId);
    if (!lawyer) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
      });
    }
    return sendSuccessResponse(
      req,
      res,
      {
        data: { ...lawyer, id: lawyer.id.toString() } as typeof lawyer & {
          id: string;
        },
        type: "single",
        serializerConfig: LawyersSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  } catch (error) {
    next(error);
  }
};
