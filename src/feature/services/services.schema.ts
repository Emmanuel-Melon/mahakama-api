import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export type ServiceCategory =
  | "all"
  | "government"
  | "legal-aid"
  | "dispute-resolution"
  | "specialized";

export const categoryIcons = {
  government: "Building2",
  "legal-aid": "Scale",
  "dispute-resolution": "HeartHandshake",
  specialized: "Shield",
} as const;

export const categoryLabels = {
  government: "Government",
  "legal-aid": "Legal Aid",
  "dispute-resolution": "Dispute Resolution",
  specialized: "Specialized",
} as const;

export const legalServicesTable = pgTable("legal_services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").$type<ServiceCategory>(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  contact: text("contact").notNull(),
  website: text("website"),
  services: jsonb("services").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const legalServiceResponseSchema = createSelectSchema(
  legalServicesTable,
  {
    createdAt: (schema) => schema.transform((val) => val.toISOString()),
    updatedAt: (schema) => schema.transform((val) => val.toISOString()),
  },
);

export type LegalService = typeof legalServicesTable.$inferSelect;
export type NewLegalService = typeof legalServicesTable.$inferInsert;
export type LegalServiceResponse = z.infer<typeof legalServiceResponseSchema>;

export interface LegalServiceInterface {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  location: string;
  contact: string;
  website?: string;
  services: string[];
}

export const serviceCategorySchema = z.enum([
  "all",
  "government",
  "legal-aid",
  "dispute-resolution",
  "specialized",
]);
export const categoryIconsSchema = z.object({
  government: z.literal("Building2"),
  "legal-aid": z.literal("Scale"),
  "dispute-resolution": z.literal("HeartHandshake"),
  specialized: z.literal("Shield"),
});
export const categoryLabelsSchema = z.object({
  government: z.literal("Government"),
  "legal-aid": z.literal("Legal Aid"),
  "dispute-resolution": z.literal("Dispute Resolution"),
  specialized: z.literal("Specialized"),
});
