import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { documentSelectSchema, type Document } from "./documents.types";

export const DocumentsSerializer: JsonApiResourceConfig<Document> = {
  type: "document",
  attributes: (document: Document) => documentSelectSchema.parse(document),
};

export const DocumentEvents = {
  DocumentCreated: {
    label: "created",
    jobName: "document-created",
  },
  DocumentUpdated: {
    label: "updated",
    jobName: "document-updated",
  },
  DocumentDeleted: {
    label: "deleted",
    jobName: "document-deleted",
  },
  DocumentDownloaded: {
    label: "downloaded",
    jobName: "document-downloaded",
  },
  DocumentBookmarked: {
    label: "bookmarked",
    jobName: "document-bookmarked",
  },
} as const;

export type DocumentsJobType =
  (typeof DocumentEvents)[keyof typeof DocumentEvents]["jobName"];

// for pagination and route queries
export const sortableFields = [
  "createdAt",
  "updatedAt",
  "title",
  "downloadCount",
] as const;
export const searchableFields = ["title", "description", "type"] as const;
export type SearchableField = (typeof searchableFields)[number];
export type SortableField = (typeof sortableFields)[number];
