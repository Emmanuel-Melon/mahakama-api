import { Router } from "express";
import { registerUserController } from "./controllers/register.controller";
import { loginUserController } from "./controllers/login.controller";
import { validateRequestBody } from "@/middleware/request-validators";
import { loginUserSchema, registerUserSchema } from "./auth.schema";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateRequestBody(registerUserSchema),
  registerUserController,
);
authRouter.post("/login", validateRequestBody(loginUserSchema), loginUserController);

export const AUTH_PATH = "/v1";
