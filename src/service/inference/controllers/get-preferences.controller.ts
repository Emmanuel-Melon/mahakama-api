import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { findPreferencesByUser } from "../operations/inference.find";

export const getPreferencesController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await findPreferencesByUser(req.params.userId);

    return sendSuccessResponse(
      req,
      res,
      { data: result.data, type: "collection" } as any,
      { status: HttpStatus.SUCCESS, additionalMeta: { total: result.count } },
    );
  },
);
