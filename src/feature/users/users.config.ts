import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { userResponseSchema, type User } from "./users.schema";
import { z } from "zod";

export const SerializedUser: JsonApiResourceConfig<User> = {
  type: "user",
  attributes: (user: User) => userResponseSchema.parse(user),
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

export type UsersJobType =
  (typeof UserEvents)[keyof typeof UserEvents]["jobName"];

// for pagination and route queries
export const sortableFields = [
  "createdAt",
  "updatedAt",
  "name",
  "email",
] as const;
export const searchableFields = ["name", "email"] as const;
export type SearchableField = (typeof searchableFields)[number];
export type SortableField = (typeof sortableFields)[number];
