import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { LegalServiceSerializer } from "../services.config";
import { getLegalServiceById } from "../operations/services.list";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getLegalServiceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = req.params.serviceId as string;

    const service = unwrap(
      await getLegalServiceById(serviceId),
      new HttpError(HttpStatus.NOT_FOUND, "Service not found"),
    );

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
  },
);
