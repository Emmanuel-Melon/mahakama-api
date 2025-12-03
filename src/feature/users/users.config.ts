import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { type User } from "./users.schema";

export const UserSerializer: JsonApiResourceConfig<User> =
{
  type: "user",
  attributes: (field) => ({
    message: field.message,
    documentation: field.documentation,
    environment: field.environment,
    timestamp: field.timestamp,
    status: field.status,
    endpoints: field.endpoints,
  }),
};

export const UserEvents = {
  UserCreated: {
    label: "user-created",
    jobName: "user-created",
  },
  UserUpdated: {
    label: "updated",
    jobName: "user-updated",
  },
  UserDeleted: {
    label: "deleted",
    jobName: "user-deleted",
  },
  UserOnboarded: {
    label: "onboarded",
    jobName: "user-onboarded",
  },
  UserVerified: {
    label: "verified",
    jobName: "user-verified",
  },
} as const;

export type UsersJobType = typeof UserEvents[keyof typeof UserEvents]['jobName'];