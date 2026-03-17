import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { desc, eq, sql } from "drizzle-orm";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { Document } from "../documents.types";

type ListDocumentsOptions = {
  limit?: number;
  offset?: number;
  type?: string;
};

export async function listDocuments({
  limit = 10,
  offset = 0,
  type,
}: ListDocumentsOptions = {}): Promise<DbManyResult<Document>> {
  const query = db.select().from(documentsTable).$dynamic();

  if (type) {
    query.where(sql`LOWER(${documentsTable.type}) = LOWER(${type})`);
  }

  const documents = await query
    .orderBy(desc(documentsTable.createdAt))
    .limit(limit)
    .offset(offset);

  return toManyResult(documents);
}
