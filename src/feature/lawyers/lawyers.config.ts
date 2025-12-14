import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { type Lawyer } from "./lawyers.schema";

export const LawyersSerializer: JsonApiResourceConfig<Lawyer> = {
  type: "lawyer",
  attributes: (lawyer: Lawyer) => lawyer,
};

export const LawyersEvents = {
  LawyerOnboarded: {
    label: "onboarded",
    jobName: "lawyer-onboarded",
  },
  LawyerVerified: {
    label: "verified",
    jobName: "lawyer-verified",
  },
} as const;

export type LawyersJobType =
  (typeof LawyersEvents)[keyof typeof LawyersEvents]["jobName"];
