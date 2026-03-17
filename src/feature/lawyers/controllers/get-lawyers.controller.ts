import { Request, Response } from "express";
import { findAll } from "../operations/lawyers.list";
import { HttpStatus } from "@/http-status";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { LawyersSerializer } from "../lawyers.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { parsePagination } from "@/lib/express/express.query";

export const getLawyersController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const result = await findAll(pagination);
    sendSuccessResponse(
      req,
      res,
      {
        data: result.data.map((lawyer) => ({
          ...lawyer,
          id: lawyer.id.toString(),
        })) as ((typeof result.data)[number] & { id: string })[],
        type: "collection",
        serializerConfig: LawyersSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
