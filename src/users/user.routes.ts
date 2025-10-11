import { Router } from "express";
import { validateCreateUser } from "./user.middleware";
import { getUsers } from "./controllers/getUsers.controller";
import { getUser } from "./controllers/getUser.controller";
import { createUser } from "./controllers/createUser.controller";

const userRouter = Router();

userRouter.get("/", (req, res, next) => {
  console.log("GET /users route handler called");
  getUsers(req, res).catch(next);
});
userRouter.get("/:id", (req, res, next) => {
  console.log(`GET /users/${req.params.id} route handler called`);
  getUser(req, res).catch(next);
});

userRouter.post("/", validateCreateUser, (req, res, next) => {
  console.log("POST /users route handler called");
  createUser(req, res).catch(next);
});

export default userRouter;
