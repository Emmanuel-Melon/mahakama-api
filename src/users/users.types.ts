import { z } from "zod";
import { User } from "./users.schema";
import { BaseExpressResponse } from "../lib/express/types";

export type UserWithoutPassword = Omit<User, "password">;

export type UserSuccessResponse = BaseExpressResponse<UserWithoutPassword> & {
  success: true;
};
export type UserErrorResponse = BaseExpressResponse<UserWithoutPassword> & {
  success: false;
};

export type UserResponse = UserSuccessResponse | UserErrorResponse;
