import { JsonApiResourceConfig } from "@/lib/express/express.types";
import {
  LegalService,
  serviceSelectSchema,
  Institution,
  institutionSelectSchema,
} from "./services.types";

export const SerializedLegalService: JsonApiResourceConfig<LegalService> = {
  type: "legal-service",
  attributes: (service: LegalService) => serviceSelectSchema.parse(service),
};

export const SerializedInstitution: JsonApiResourceConfig<Institution> = {
  type: "institution",
  attributes: (institution: Institution) =>
    institutionSelectSchema.parse(institution),
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
