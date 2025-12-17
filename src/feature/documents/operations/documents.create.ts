import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { NewDocument, type Document } from "../documents.types";

export async function createDocument(
  documentData: NewDocument,
): Promise<Document> {
  const [document] = await db
    .insert(documentsTable)
    .values(documentData)
    .returning();
  return document;
}
