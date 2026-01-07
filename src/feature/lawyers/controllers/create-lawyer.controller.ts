import { Request, Response, NextFunction } from "express";
import { db } from "@/lib/drizzle";
import { createLawyer } from "../operations/lawyers.create";
import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { LawyersSerializer } from "../lawyers.config";

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
      return sendErrorResponse(req, res, {
        status: HttpStatus.CONFLICT,
      });
    }
    const lawyer = await createLawyer(lawyerAttrs);
    if (!lawyer) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
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
