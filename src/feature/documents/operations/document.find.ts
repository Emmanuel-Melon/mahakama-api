import { db } from "@/lib/drizzle";
import { documentsTable, Document } from "../documents.schema";
import { eq } from "drizzle-orm";

export async function findDocumentById(id: number): Promise<Document | null> {
  const [document] = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.id, id));

  return document || null;
}
