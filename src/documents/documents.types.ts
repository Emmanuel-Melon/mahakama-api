import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { documentsTable } from "./documents.schema";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  sections: z.number().int().positive("Sections must be a positive number"),
  lastUpdated: z.string().length(4, "Last updated year must be 4 digits"),
  storageUrl: z
    .string()
    .url("Invalid URL format")
    .min(1, "Storage URL is required"),
});

export const documentResponseSchema = createSelectSchema(documentsTable);

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type Document = z.infer<typeof documentResponseSchema>;
export type NewDocument = typeof documentsTable.$inferInsert;
