import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import {
  bookmarksTable,
  documentsTable,
  downloadsTable,
} from "./documents.schema";
import { DocumentJobs } from "./document.config";

export const documentSelectSchema = createSelectSchema(documentsTable);
export const documentInsertSchema = createInsertSchema(documentsTable);

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

export type DocumentIngestionEventType = DocumentIngestionEvent["type"];
export type Bookmark = typeof bookmarksTable.$inferSelect;
export type NewBookmark = typeof bookmarksTable.$inferInsert;
export type Download = typeof downloadsTable.$inferSelect;
export type NewDownload = typeof downloadsTable.$inferInsert;
export type Document = z.infer<typeof documentSelectSchema>;
export type NewDocument = z.infer<typeof documentInsertSchema>;

export type DocumentEventType =
  | "started"
  | "progress"
  | "content"
  | "completed"
  | "error";

export type DocumentIngestionEvent = Extract<
  {
    [K in DocumentEventType]: {
      type: K;
      data: K extends "started"
        ? {
            timestamp: string;
            filename: string;
            size: number;
          }
        : K extends "progress"
          ? {
              processed: number;
              total: number;
              percentage: number;
              chunk: number;
              totalChunks: number;
            }
          : K extends "content"
            ? {
                chunk: number;
                preview: string;
              }
            : K extends "completed"
              ? {
                  filename: string;
                  size: number;
                  processedAt: string;
                  totalChunks: number;
                }
              : K extends "error"
                ? {
                    message: string;
                    code?: string;
                    details?: unknown;
                  }
                : never;
    };
  }[DocumentEventType],
  { type: string; data: any }
>;

export interface LegalDocumentChunk {
  id: string;
  title: string;
  category: string;
  source: string;
  content: string;
  similarity?: number;
}

export interface DocumentJobTypes {
  [DocumentJobs.DocumentUploaded.jobName]: {
    documentId: string;
    userId: string;
  };
}

export interface BookmarkDocumentParams {
  documentId: string;
  user_id: string;
}

export interface DownloadDocumentParams {
  documentId: string;
  user_id: string;
}

export interface ShareDocumentParams {
  documentId: string;
}

export interface DocumentShareInfo {
  documentId: string;
  title: string;
  shareableLink: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    email: string;
  };
}
