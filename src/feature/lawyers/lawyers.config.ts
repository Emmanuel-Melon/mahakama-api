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

export const legalSpecializations = [
  "Corporate Law",
  "Criminal Law",
  "Family Law",
  "Real Estate Law",
  "Immigration Law",
  "Intellectual Property Law",
  "Tax Law",
  "Employment Law",
  "Personal Injury Law",
  "Bankruptcy Law",
  "Environmental Law",
  "Civil Rights Law",
];

export const commonLanguages = [
  ["English", "Swahili"],
  ["English", "Swahili", "French"],
  ["English", "Swahili", "Arabic"],
  ["English", "French"],
  ["English", "Swahili", "Kinyarwanda"],
  ["English", "Luganda", "Swahili"],
];

export const locations = [
  { city: "Nairobi", country: "Kenya" },
  { city: "Mombasa", country: "Kenya" },
  { city: "Kampala", country: "Uganda" },
  { city: "Dar es Salaam", country: "Tanzania" },
  { city: "Kigali", country: "Rwanda" },
  { city: "Nakuru", country: "Kenya" },
  { city: "Eldoret", country: "Kenya" },
  { city: "Kisumu", country: "Kenya" },
  { city: "Arusha", country: "Tanzania" },
  { city: "Entebbe", country: "Uganda" },
  { city: "Juba", country: "South Sudan" },
];

export type LawyersJobType =
  (typeof LawyersEvents)[keyof typeof LawyersEvents]["jobName"];
