export interface AuthJobData {
  userId?: string;
  email?: string;
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
