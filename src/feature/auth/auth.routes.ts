import { Router } from "express";
import { registerUserController } from "./controllers/register.controller";
import { loginUserController } from "./controllers/login.controller";
import { validateRequestBody } from "@/middleware/request-validators";
import { LoginRequestSchema, RegisterRequestSchema } from "./auth.schema";

export const authRouter = Router();
authRouter.post(
  "/register",
  validateRequestBody(RegisterRequestSchema),
  registerUserController,
);
authRouter.post(
  "/login",
  validateRequestBody(LoginRequestSchema),
  loginUserController,
);

export const authRoutes = authRouter.stack.map((layer) => layer.route?.path);
export const AUTH_PATH = "/v1";
