export const AuthEvents = {
  Login: {
    label: "login",
    jobName: "auth:login",
  },
  Registration: {
    label: "registration",
    jobName: "auth:registration",
  },
  Logout: {
    label: "logout",
    jobName: "auth:logout",
  },
} as const;

export type AuthJobType =
  (typeof AuthEvents)[keyof typeof AuthEvents]["jobName"];
