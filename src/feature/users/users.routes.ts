import { Router } from "express";
import { validateRequestBody } from "@/middleware/request-validators";
import { getUsersController } from "./controllers/get-users.controller";
import { getUserController } from "./controllers/get-user.controller";
import { createUserController } from "./controllers/create-user.controller";
import { updateUserController } from "./controllers/update-user.controller";
import { getCurrentUserController } from "./controllers/get-current-user.controller";
import { createUserSchema } from "./users.schema";
import { withPagination } from "@/middleware/with-pagination";

const userRouter = Router();

userRouter.get("/me", getCurrentUserController);
userRouter.get("/", withPagination, getUsersController);
userRouter.get("/:id", getUserController);
userRouter.post("/", validateRequestBody(createUserSchema), createUserController);
userRouter.patch(
  "/:id",
  validateRequestBody(createUserSchema.partial()),
  updateUserController,
);

export default userRouter;
export const USERS_PATH = "/v1/users";
