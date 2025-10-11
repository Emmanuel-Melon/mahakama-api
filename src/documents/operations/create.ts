import { db } from "../../lib/drizzle";
import { documentsTable } from "../document.schema";
import { NewDocument } from "../document.types";

export async function createDocument(documentData: NewDocument) {
  const [newDocument] = await db
    .insert(documentsTable)
    .values(documentData)
    .returning();

  return newDocument;
}
