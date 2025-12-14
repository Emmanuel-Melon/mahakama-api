import { User } from "@/feature/users/users.schema";
import {
  JsonApiErrorResponse,
  JsonApiResponse,
} from "@/lib/express/express.types";

export interface AuthJobData {
  userId?: string;
  email?: string;
  name?: string;
  password?: string;
  timestamp?: number;
  [key: string]: any;
}

export const UserAuthStates = {
  USER: "user" as const,
  ANONYMOUS: "anonymous" as const,
} as const;

export type UserAuthStates =
  (typeof UserAuthStates)[keyof typeof UserAuthStates];
export const UserAuthStatesValues = Object.values(UserAuthStates) as [
  string,
  ...string[],
];

export type UserWithoutPassword = Omit<User, "password">;

type AuthData = {
  user: UserWithoutPassword;
  token?: string;
};

export type AuthSuccessResponse = JsonApiResponse<AuthData>;

export type AuthErrorResponse = JsonApiErrorResponse;

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export type RegisterData = {
  user: UserWithoutPassword;
};

export type RegisterSuccessResponse = JsonApiResponse<RegisterData>;

export type RegisterErrorResponse = AuthErrorResponse;

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;
