import { Router } from "express";
import { getLegalServicesController } from "./controllers/getServices.controller";
import { getLegalServiceByIdController } from "./controllers/getServiceById.controller";

const servicesRouter = Router();

servicesRouter.get("/", getLegalServicesController);
servicesRouter.get("/:serviceId", getLegalServiceByIdController);

export { servicesRouter };

export const SERVICES_PATH = "/v1/services";
