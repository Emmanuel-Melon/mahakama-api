import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { LegalService, legalServiceResponseSchema } from "./services.schema";

export const LegalServiceSerializer: JsonApiResourceConfig<LegalService> = {
  type: "legal-service",
  attributes: (service: LegalService) => legalServiceResponseSchema.parse(service),
};

export const LegalServiceEvents = {
  ServiceCreated: {
    label: "created",
    jobName: "legal-service-created",
  },
  ServiceUpdated: {
    label: "updated",
    jobName: "legal-service-updated",
  },
  ServiceDeleted: {
    label: "deleted",
    jobName: "legal-service-deleted",
  },
} as const;

export type LegalServicesJobType =
  (typeof LegalServiceEvents)[keyof typeof LegalServiceEvents]["jobName"];