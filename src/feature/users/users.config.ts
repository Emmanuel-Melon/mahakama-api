import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { type User } from "./users.schema";

export const UserSerializer: JsonApiResourceConfig<User> =
{
  type: "welcome",
  attributes: (t) => ({
    message: t.message,
    documentation: t.documentation,
    environment: t.environment,
    timestamp: t.timestamp,
    status: t.status,
    endpoints: t.endpoints,
  }),
};

export enum UsersJobType {
  UserCreated = "user-created",
  UserUpdated = "user-updated",
  UserDeleted = "user-deleted",
  UserOnboarded = "user-onboarded",
  UserVerified = "user-verified",
}