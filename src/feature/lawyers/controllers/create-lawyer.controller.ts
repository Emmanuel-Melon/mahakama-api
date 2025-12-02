import { Request, Response, NextFunction } from "express";
import { db } from "@/lib/drizzle";
import { createLawyer } from "../operations/lawyers.create";
import { lawyersTable, lawyerResponseSchema } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/express/http-status";

export const createLawyerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lawyerAttrs = req.body;
    const [existingLawyer] = await db
      .select()
      .from(lawyersTable)
      .where(eq(lawyersTable.email, lawyerAttrs.email))
      .limit(1);

    if (existingLawyer) {
      return sendErrorResponse(res, HttpStatus.CONFLICT);
    }
    const lawyer = await createLawyer(lawyerAttrs);
    return sendSuccessResponse(
      res,
      { lawyer: lawyerResponseSchema.parse(lawyer) },
      {
        status: HttpStatus.CREATED,
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
