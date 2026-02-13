import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { lawyersTable } from "./lawyers.schema";

export const createLawyerSchema = createInsertSchema(lawyersTable);
export const lawyerSelectSchema = createSelectSchema(lawyersTable);
export const lawyersListResponseSchema = z.array(lawyerSelectSchema);

// Types
export type NewLawyer = z.infer<typeof createLawyerSchema>;
export type Lawyer = z.infer<typeof lawyerSelectSchema>;

export type LawyerFilters = {
  specialization?: string;
  location?: string;
  isAvailable?: boolean;
  q?: string;
};
