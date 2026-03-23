import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { InferenceStrategyRegistry } from "../inference.registry";

export const getStrategiesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const keys = InferenceStrategyRegistry.registeredKeys();

    return sendSuccessResponse(
      _req,
      res,
      { data: keys.map((key) => ({ key })), type: "collection" } as any,
      { status: HttpStatus.SUCCESS },
    );
  },
);
