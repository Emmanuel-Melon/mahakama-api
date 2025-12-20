import { Request, Response, NextFunction } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { LegalServiceSerializer } from "../services.config";
import { getLegalServiceById } from "../operations/services.list";

export const getLegalServiceByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.BAD_REQUEST,
        title: "Bad Request",
        description: "Service ID is required",
      });
    }

    const service = await getLegalServiceById(serviceId);

    if (!service) {
      return sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
        title: "Not Found",
        description: "Legal service not found",
      });
    }

    sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...service,
          serviceId: service.id.toString(),
        } as typeof service & { serviceId: string },
        type: "single",
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
