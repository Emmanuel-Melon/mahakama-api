import { Request, Response, NextFunction } from "express";
import { db } from "@/lib/drizzle";
import { updateLawyer } from "../operations/lawyers.update";
import { lawyersTable } from "../lawyers.schema";
import { eq, and, not } from "drizzle-orm";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { LawyersSerializer } from "../lawyers.config";

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
      return sendErrorResponse(req, res, {
        status: HttpStatus.CONFLICT,
      });
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

    const lawyer = await updateLawyer(lawyerId, updateData);

    return sendSuccessResponse(
      req,
      res,
      {
        data: { ...lawyer, id: lawyer?.id.toString() } as typeof lawyer & { id: string },
        type: "single",
        serializerConfig: LawyersSerializer,
      },
      {
        status: HttpStatus.ACCEPTED,
      },
    );
  } catch (error) {
    next(error);
  }
};
