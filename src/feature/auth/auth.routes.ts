import { Router } from "express";
import { registerUserController } from "./controllers/register.controller";
import { loginUserController } from "./controllers/login.controller";
import { validate } from "@/middleware/request-validators";
import { loginUserSchema, registerUserSchema } from "./auth.schema";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerUserSchema),
  registerUserController,
);
authRouter.post("/login", validate(loginUserSchema), loginUserController);

export default authRouter;

export const AUTH_PATH = "/v1";
