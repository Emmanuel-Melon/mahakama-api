export const AuthEvents = {
  Login: {
    label: "login",
    jobName: "auth:login",
    logs: {
      GET: '[Auth:Login]',
      CREATE: '[Auth:Create]',
      UPDATE: '[Auth:Update]',
      DELETE: '[Auth:Delete]',
    }
  },
  Registration: {
    label: "registration",
    jobName: "auth:registration",
    logs: {
      GET: '[Auth:Registration]',
      CREATE: '[Auth:Create]',
      UPDATE: '[Auth:Update]',
      DELETE: '[Auth:Delete]',
    }
  },
  Logout: {
    label: "logout",
    jobName: "auth:logout",
    logs: {
      GET: '[Auth:Logout]',
      CREATE: '[Auth:Create]',
      UPDATE: '[Auth:Update]',
      DELETE: '[Auth:Delete]',
    }
  },
} as const;

export type AuthJobType = typeof AuthEvents[keyof typeof AuthEvents]['jobName'];
