import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedLegalService } from "../services.config";
import { findAllServices } from "../operations/services.find";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getLegalServicesController = asyncHandler(
  async (req: Request, res: Response) => {
    const services = await findAllServices();
    sendSuccessResponse(
      req,
      res,
      {
        data: services.data,
        type: "collection",
        serializerConfig: SerializedLegalService,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
