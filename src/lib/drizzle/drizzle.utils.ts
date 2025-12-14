import { db } from ".";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";

export type ConditionalQuery = {
  conditions: readonly string[];
  schema: any;
};

export const buildQueryWithConditions = ({
  conditions,
  schema,
}: ConditionalQuery) => {
  const baseQuery = db.select().from(schema);
  const queryWithConditions =
    conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;
  return queryWithConditions;
};

export const countResults = async ({
  conditions,
  schema,
}: ConditionalQuery) => {
  const countResult = await (conditions.length > 0
    ? db
        .select({ count: sql<number>`count(*)` })
        .from(schema)
        .where(and(...conditions))
    : db.select({ count: sql<number>`count(*)` }).from(schema));
  return Number(countResult[0]?.count || 0);
};

export const sortConditionalQueryResults = (
  queryWithConditions,
  { sortDirection, sortField, schema, limit, offset },
) => {
  queryWithConditions
    .orderBy(
      sortDirection === "asc"
        ? asc(schema[sortField])
        : desc(schema[sortField]),
    )
    .limit(limit)
    .offset(offset);
};
