import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { LegalServiceSerializer } from "../services.config";
import { getLegalServices } from "../operations/services.list";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getLegalServicesController = asyncHandler(async (req: Request, res: Response) => {
  const services = await getLegalServices();
  sendSuccessResponse(
    req,
    res,
    {
      data: services.map((service) => ({
        ...service,
        id: service.id.toString(),
      })) as ((typeof services)[number] & { id: string })[],
      type: "collection",
      serializerConfig: LegalServiceSerializer,
    },
    {
      status: HttpStatus.SUCCESS,
    },
  );
});
