import { db } from "@/lib/drizzle";
import { usersSchema } from "../users.schema";
import { User } from "../users.schema";
import { GetUsersQuery } from "../users.types";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { BaseSortParams, BaseFilterParams } from "@/lib/express/express.types";
import { getPaginationParams, getSortConfig } from "@/lib/express/pagination";
import { checkUserRole } from "@/feature/auth/auth.utils";
import { applySearchConditions } from "@/lib/express/pagination";
import { sortableFields, searchableFields } from "../users.config";
import {
  buildQueryWithConditions,
  countResults,
  sortConditionalQueryResults,
} from "@/lib/drizzle/drizzle.utils";

export async function findAll(options?: GetUsersQuery): Promise<{
  users: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}> {
  const { page, limit, offset } = getPaginationParams({
    page: options?.page,
    limit: options?.limit,
    maxLimit: 100,
    defaultLimit: 10,
  });

  const baseQuery = db.select().from(usersSchema);
  const users = await baseQuery.limit(limit).offset(offset);

  return {
    users,
    total: users.length,
    page,
    limit,
    pages: Math.ceil(users.length / limit) || 1,
    hasNext: page * limit < users.length,
    hasPrevious: page > 1,
  };
}

  // const conditions = [];

  // if (options?.role && checkUserRole(options.role)) {
  //   conditions.push(eq(usersSchema.role, options.role));
  // }
  // const searchConditions = applySearchConditions(options, {
  //   schema: usersSchema,
  //   searchQuery: (options as BaseFilterParams)?.search,
  //   fields: searchableFields
  // });
  // if (searchConditions) {
  //   conditions.push(searchConditions);
  // }
  // const myConditionalQuery = buildQueryWithConditions({ conditions, schema: usersSchema });
  // console.log("myConditionalQuery", myConditionalQuery);

  // const baseQuery = db.select().from(usersSchema);
  // const queryWithConditions = conditions.length > 0
  //   ? baseQuery.where(and(...conditions))
  //   : baseQuery;

  // const countResult = await (conditions.length > 0
  //   ? db.select({ count: sql<number>`count(*)` }).from(usersSchema).where(and(...conditions))
  //   : db.select({ count: sql<number>`count(*)` }).from(usersSchema));
  // const total = Number(countResult[0]?.count || 0);

  // const countedtotal = countResults({ conditions, schema: usersSchema });
  // console.log(countedtotal);

  // const { field: sortField, direction: sortDirection } = getSortConfig({
  //   sortBy: options?.sortBy,
  //   order: (options as BaseSortParams)?.order,
  //   validFields: sortableFields,
  //   defaultField: 'createdAt',
  //   defaultDirection: 'desc'
  // });

  // const myUsers = sortConditionalQueryResults(queryWithConditions, {
  //   limit,
  //   offset,
  //   sortDirection,
  //   sortField,
  //   schema: usersSchema
  // });
  // console.log("myUsers", myUsers);