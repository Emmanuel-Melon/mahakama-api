import { Request, Response } from "express";
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
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";

export const updateLawyerController = asyncHandler(
  async (req: Request, res: Response) => {
    const lawyerId = req.params.id as string;
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

    const lawyer = unwrap(await updateLawyer(Number(lawyerId), updateData));

    return sendSuccessResponse(
      req,
      res,
      {
        data: { ...lawyer, id: lawyer?.id.toString() } as typeof lawyer & {
          id: string;
        },
        type: "single",
        serializerConfig: LawyersSerializer,
      },
      {
        status: HttpStatus.ACCEPTED,
      },
    );
  },
);
