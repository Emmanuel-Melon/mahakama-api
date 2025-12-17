import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { usersSchema } from "@/feature/users/users.schema";
import { relations } from "drizzle-orm";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const documentsTable = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  sections: integer("sections").notNull(),
  lastUpdated: varchar("last_updated", { length: 4 }).notNull(),
  storageUrl: text("storage_url").notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookmarksTable = pgTable(
  "document_bookmarks",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersSchema.id, { onDelete: "cascade" }),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documentsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.user_id, table.documentId] }),
    };
  },
);

export const downloadsTable = pgTable("document_downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
  document_id: uuid("document_id")
    .notNull()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

// relations
export const documentsRelations = relations(documentsTable, ({ many }) => ({
  bookmarks: many(bookmarksTable),
  downloads: many(downloadsTable),
}));

export const bookmarksRelations = relations(bookmarksTable, ({ one }) => ({
  user: one(usersSchema, {
    fields: [bookmarksTable.user_id],
    references: [usersSchema.id],
  }),
  document: one(documentsTable, {
    fields: [bookmarksTable.documentId],
    references: [documentsTable.id],
  }),
}));

export const downloadsRelations = relations(downloadsTable, ({ one }) => ({
  user: one(usersSchema, {
    fields: [downloadsTable.user_id],
    references: [usersSchema.id],
  }),
  document: one(documentsTable, {
    fields: [downloadsTable.document_id],
    references: [documentsTable.id],
  }),
}));

export const combinedDocumentsSchema = {
  documentsTable,
  bookmarksTable,
  downloadsTable,
  documentsRelations,
  bookmarksRelations,
  downloadsRelations,
};
