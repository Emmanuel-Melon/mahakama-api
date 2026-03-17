import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { NewDocument, type Document } from "../documents.types";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import { HttpError } from "@/lib/http/http.error";

export async function createDocument(
  documentData: NewDocument,
  p0: HttpError,
): Promise<DbResult<Document>> {
  const [document] = await db
    .insert(documentsTable)
    .values(documentData)
    .returning();
  return toResult(document);
}
