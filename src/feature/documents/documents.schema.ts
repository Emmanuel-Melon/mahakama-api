import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { usersSchema } from "@/users/users.schema";
import { createSelectSchema } from "drizzle-zod";

export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
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
    documentId: integer("document_id")
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
  id: serial("id").primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
  document_id: integer("document_id")
    .notNull()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

export type Bookmark = typeof bookmarksTable.$inferSelect;
export type NewBookmark = typeof bookmarksTable.$inferInsert;

export type Download = typeof downloadsTable.$inferSelect;
export type NewDownload = typeof downloadsTable.$inferInsert;

// Schema for document responses
export const documentResponseSchema = createSelectSchema(documentsTable);
export type Document = z.infer<typeof documentResponseSchema>;
