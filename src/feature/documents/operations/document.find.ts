import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { eq } from "drizzle-orm";
import { Document } from "../documents.types";

export async function findDocumentById(id: string): Promise<Document | null> {
  const [document] = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.id, id));
  return document || null;
}
