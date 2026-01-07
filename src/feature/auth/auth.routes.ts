import { Router } from "express";
import { registerUserController } from "./controllers/register.controller";
import { loginUserController } from "./controllers/login.controller";
import { logoutController } from "./controllers/logout.controller";
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
authRouter.post("/logout", logoutController);

export const authRoutes = authRouter.stack.map((layer) => layer.route?.path);
export const AUTH_PATH = "/v1";
