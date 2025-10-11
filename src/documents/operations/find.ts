import { db } from "../../lib/drizzle";
import { documentsTable } from "../document.schema";
import { eq } from "drizzle-orm";

export async function findDocumentById(id: number) {
  const [document] = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.id, id));

  return document || null;
}
