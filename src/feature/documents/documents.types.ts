import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { documentsTable } from "./documents.schema";

export type EventType = "started" | "progress" | "content" | "completed" | "error";

export type DocumentIngestionEvent = Extract<
  {
    [K in EventType]: {
      type: K;
      data: K extends "started" ? {
        timestamp: string;
        filename: string;
        size: number;
      } : K extends "progress" ? {
        processed: number;
        total: number;
        percentage: number;
        chunk: number;
        totalChunks: number;
      } : K extends "content" ? {
        chunk: number;
        preview: string;
      } : K extends "completed" ? {
        filename: string;
        size: number;
        processedAt: string;
        totalChunks: number;
      } : K extends "error" ? {
        message: string;
        code?: string;
        details?: unknown;
      } : never;
    }
  }[EventType],
  { type: string; data: any }
>;

export const documentIngestionEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("started"),
    data: z.object({
      timestamp: z.string().datetime(),
      filename: z.string(),
      size: z.number().int().nonnegative(),
    }),
  }),
  z.object({
    type: z.literal("progress"),
    data: z.object({
      processed: z.number().int().nonnegative(),
      total: z.number().int().positive(),
      percentage: z.number().min(0).max(100),
      chunk: z.number().int().positive(),
      totalChunks: z.number().int().positive(),
    }),
  }),
  z.object({
    type: z.literal("content"),
    data: z.object({
      chunk: z.number().int().positive(),
      preview: z.string(),
    }),
  }),
  z.object({
    type: z.literal("completed"),
    data: z.object({
      filename: z.string(),
      size: z.number().int().nonnegative(),
      processedAt: z.string().datetime(),
      totalChunks: z.number().int().positive(),
    }),
  }),
  z.object({
    type: z.literal("error"),
    data: z.object({
      message: z.string(),
      code: z.string().optional(),
      details: z.unknown().optional(),
    }),
  }),
]);

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
export type DocumentIngestionEventType = DocumentIngestionEvent["type"];

export function isDocumentIngestionEvent(
  event: unknown
): event is DocumentIngestionEvent {
  try {
    documentIngestionEventSchema.parse(event);
    return true;
  } catch {
    return false;
  }
}
