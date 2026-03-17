import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { lawyersTable } from "./lawyers.schema";
import { LawyerJobs } from "./lawyers.config";
import { baseQuerySchema } from "@/lib/express/express.types";

export const createLawyerSchema = createInsertSchema(lawyersTable);
export const lawyerSelectSchema = createSelectSchema(lawyersTable);
export const lawyersListResponseSchema = z.array(lawyerSelectSchema);

// Types
export type NewLawyer = z.infer<typeof createLawyerSchema>;
export type Lawyer = z.infer<typeof lawyerSelectSchema>;

export interface LawyersJobTypes {
  [LawyerJobs.LawyerOnboarded.jobName]: {
    lawyerId: string;
    userId: string;
  };
  [LawyerJobs.LawyerVerified.jobName]: {
    lawyerId: string;
    userId: string;
    verifiedBy: string;
  };
}

export const lawyerQuerySchema = baseQuerySchema.extend({
  specialization: z.string().optional(),
  location: z.string().optional(),
  available: z.preprocess((val) => val === "true", z.boolean()).optional(),
});

export type LawyerFilters = z.infer<typeof lawyerQuerySchema>;
