import { db } from "../../lib/drizzle";
import { documentsTable, Document } from "../documents.schema";
import { NewDocument } from "../documents.types";

export async function createDocument(
  documentData: NewDocument,
): Promise<Document> {
  const [newDocument] = await db
    .insert(documentsTable)
    .values(documentData)
    .returning();

  return newDocument;
}
