import { db } from "../../lib/drizzle";
import { documentsTable } from "../document.schema";
import { desc, eq, sql } from "drizzle-orm";

type ListDocumentsOptions = {
  limit?: number;
  offset?: number;
  type?: string;
};

export async function listDocuments({
  limit = 10,
  offset = 0,
  type,
}: ListDocumentsOptions = {}) {
  // First get the count
  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(documentsTable);

  // Then get the paginated data
  const query = db
    .select()
    .from(documentsTable)
    .$dynamic();

  if (type) {
    query.where(sql`LOWER(${documentsTable.type}) = LOWER(${type})`);
  }

  const documents = await query
    .orderBy(desc(documentsTable.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    data: documents,
    total: Number(count?.count) || 0,
  };
}
