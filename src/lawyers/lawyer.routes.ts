import { Router } from "express";
import { getLawyers } from "./controllers/getLawyers.controller";
import { getLawyerById } from "./controllers/getLawyerById.controller";
import { getLawyerByEmail } from "./controllers/getLawyerByEmail.controller";
import { createLawyerHandler } from "./controllers/createLawyer.controller";
import { updateLawyerHandler } from "./controllers/updateLawyer.controller";

const lawyerRoutes = Router();

// GET routes
lawyerRoutes.get("/", getLawyers);
lawyerRoutes.get("/:id", getLawyerById);
lawyerRoutes.get("/email", getLawyerByEmail);

// POST and PUT routes
lawyerRoutes.post("/", createLawyerHandler);
lawyerRoutes.put("/:id", updateLawyerHandler);

export default lawyerRoutes;
