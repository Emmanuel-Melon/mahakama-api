import { Request, Response, NextFunction } from "express";
import { db } from "@/lib/drizzle";
import { updateLawyer } from "../operations/lawyers.update";
import { lawyersTable } from "../lawyers.schema";
import { eq, and, not } from "drizzle-orm";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/express/http-status";

export const updateLawyerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const lawyerId = parseInt(id, 10);
    const updateData = req.body;
    const [existingLawyer] = await db
      .select()
      .from(lawyersTable)
      .where(eq(lawyersTable.id, lawyerId))
      .limit(1);

    if (!existingLawyer) {
      return sendErrorResponse(res, HttpStatus.CONFLICT);
    }

    if (updateData.email && updateData.email !== existingLawyer.email) {
      const [emailInUse] = await db
        .select()
        .from(lawyersTable)
        .where(
          and(
            eq(lawyersTable.email, updateData.email),
            not(eq(lawyersTable.id, lawyerId)),
          ),
        )
        .limit(1);
    }

    const updatedLawyer = await updateLawyer(lawyerId, updateData);

    return sendSuccessResponse(
      res,
      { lawyer: updatedLawyer },
      {
        status: HttpStatus.ACCEPTED,
        requestId: req.requestId,
      },
    );
  } catch (error) {
    next(error);
  }
};
