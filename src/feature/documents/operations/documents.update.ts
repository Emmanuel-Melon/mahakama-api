import { db } from "@/lib/drizzle";
import {
  documentsTable,
  bookmarksTable,
  downloadsTable,
} from "../documents.schema";
import type { Bookmark, Document } from "../documents.types";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { findDocumentById } from "./document.find";

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

export async function bookmarkDocument({
  documentId,
  user_id,
}: BookmarkDocumentParams): Promise<Document> {
  const document = await findDocumentById(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  const [existingBookmark] = await db
    .select()
    .from(bookmarksTable)
    .where(
      and(
        eq(bookmarksTable.user_id, user_id),
        eq(bookmarksTable.documentId, documentId),
      ),
    )
    .limit(1);

  let bookmarked: boolean;

  if (existingBookmark) {
    await db
      .delete(bookmarksTable)
      .where(
        and(
          eq(bookmarksTable.user_id, user_id),
          eq(bookmarksTable.documentId, documentId),
        ),
      );
    bookmarked = false;
  } else {
    await db
      .insert(bookmarksTable)
      .values({
        user_id,
        documentId,
      })
      .onConflictDoNothing();
    bookmarked = true;
  }

  return document;
}

export async function downloadDocument({
  documentId,
  user_id,
}: DownloadDocumentParams) {
  return db.transaction(async (tx) => {
    const [document] = await tx
      .select({
        id: documentsTable.id,
        storageUrl: documentsTable.storageUrl,
        downloadCount: documentsTable.downloadCount,
      })
      .from(documentsTable)
      .where(eq(documentsTable.id, documentId))
      .limit(1);

    if (!document) {
      throw new Error("Document not found");
    }

    await tx.insert(downloadsTable).values({
      user_id,
      document_id: documentId,
    });

    const [updatedDocument] = await tx
      .update(documentsTable)
      .set({
        downloadCount: document.downloadCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(documentsTable.id, documentId))
      .returning({ downloadCount: documentsTable.downloadCount });

    return updatedDocument;
  });
}

export async function getDocumentShareInfo({
  documentId,
}: ShareDocumentParams): Promise<DocumentShareInfo> {
  const [document] = await db
    .select({
      id: documentsTable.id,
      title: documentsTable.title,
      description: documentsTable.description,
      type: documentsTable.type,
    })
    .from(documentsTable)
    .where(eq(documentsTable.id, documentId))
    .limit(1);

  if (!document) {
    throw new Error("Document not found");
  }

  const shareableLink = `https://mahakama.app/documents/${documentId}`;

  return {
    documentId,
    title: document.title,
    shareableLink,
    socialLinks: {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent(document.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${document.title} - ${shareableLink}`)}`,
      email: `mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(`Check out this document: ${shareableLink}`)}`,
    },
  };
}
