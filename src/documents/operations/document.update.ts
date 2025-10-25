import { db } from "../../lib/drizzle";
import {
  documentsTable,
  bookmarksTable,
  downloadsTable,
  type Bookmark,
} from "../document.schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { findDocumentById } from "./document.find";

export interface BookmarkDocumentParams {
  documentId: number;
  userId: string;
}

export interface DownloadDocumentParams {
  documentId: number;
  userId: string;
}

export interface ShareDocumentParams {
  documentId: number;
}

export interface DocumentShareInfo {
  documentId: number;
  title: string;
  shareableLink: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
  };
}

export async function bookmarkDocument({
  documentId,
  userId,
}: BookmarkDocumentParams): Promise<{
  success: boolean;
  message: string;
  documentId: number;
  bookmarked: boolean;
}> {
  const document = await findDocumentById(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  const [existingBookmark] = await db
    .select()
    .from(bookmarksTable)
    .where(
      and(
        eq(bookmarksTable.userId, userId),
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
          eq(bookmarksTable.userId, userId),
          eq(bookmarksTable.documentId, documentId),
        ),
      );
    bookmarked = false;
  } else {
    await db
      .insert(bookmarksTable)
      .values({
        userId,
        documentId,
      })
      .onConflictDoNothing();
    bookmarked = true;
  }

  return {
    success: true,
    message: bookmarked
      ? "Document bookmarked successfully"
      : "Document unbookmarked successfully",
    documentId,
    bookmarked,
  };
}

export async function downloadDocument({
  documentId,
  userId,
}: DownloadDocumentParams): Promise<{
  success: boolean;
  message: string;
  documentId: number;
  downloadUrl: string;
  timestamp: string;
  downloadCount: number;
}> {
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
      userId,
      documentId,
    });

    const [updatedDocument] = await tx
      .update(documentsTable)
      .set({
        downloadCount: document.downloadCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(documentsTable.id, documentId))
      .returning({ downloadCount: documentsTable.downloadCount });

    return {
      success: true,
      message: "Download recorded successfully",
      documentId,
      downloadUrl: document.storageUrl,
      timestamp: new Date().toISOString(),
      downloadCount: updatedDocument.downloadCount,
    };
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
    },
  };
}
