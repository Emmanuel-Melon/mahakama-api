import { User } from "../users/user.schema";

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

type BaseResponse<T> = {
  success: boolean;
  data: T;
};

type AuthSuccessData = {
  user: UserWithoutPassword;
  token?: string;
};

type AuthErrorData = {
  user: null;
  error: string;
};

export type AuthSuccessResponse = BaseResponse<AuthSuccessData> & {
  success: true;
};
export type AuthErrorResponse = BaseResponse<AuthErrorData> & {
  success: false;
};
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

// Register specific types
export type RegisterUserData = {
  user: UserWithoutPassword;
};

export type RegisterSuccessResponse = BaseResponse<RegisterUserData> & {
  success: true;
};
export type RegisterErrorResponse = AuthErrorResponse;
export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;
