import { Router } from "express";
import { getLawyers } from "./controllers/getLawyers.controller";
import { getLawyerById } from "./controllers/getLawyerById.controller";
import { getLawyerByEmail } from "./controllers/getLawyerByEmail.controller";

const lawyerRoutes = Router();

lawyerRoutes.get("/", getLawyers);
lawyerRoutes.get("/:id", getLawyerById);
lawyerRoutes.get("/email", getLawyerByEmail);

export default lawyerRoutes;
