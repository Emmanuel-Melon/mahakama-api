import { Router } from "express";
import { getLegalServicesController } from "./controllers/getServices.controller";
import { getLegalServiceByIdController } from "./controllers/getServiceById.controller";

const router = Router();

router.get("/", getLegalServicesController);
router.get("/:serviceId", getLegalServiceByIdController);

export { router as servicesRoutes };

export const SERVICES_PATH = "/v1/services";
