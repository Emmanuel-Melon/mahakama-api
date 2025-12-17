import { Request, Response, NextFunction } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { LegalServiceSerializer } from "../services.config";
import { getLegalServices } from "../operations/services.list";

export const getLegalServicesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const services = await getLegalServices();
    sendSuccessResponse(
      req,
      res,
      {
        data: services.map(service => ({ ...service, id: service.id.toString() })) as (typeof services[number] & { id: string })[],
        type: "collection",
        serializerConfig: LegalServiceSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    next(error);
  }
};