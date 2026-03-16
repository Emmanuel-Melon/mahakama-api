import { db } from "@/lib/drizzle";
import { usersSchema } from "../users.schema";
import type { User } from "../users.types";
import { GetUsersQuery } from "../users.types";
import { getPaginationParams } from "@/lib/express/pagination";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";

export async function findAll(options?: GetUsersQuery): Promise<DbManyResult<User>> {
  const { page, limit, offset } = getPaginationParams({
    page: options?.page,
    limit: options?.limit,
    maxLimit: 100,
    defaultLimit: 10,
  });

  const baseQuery = db.select().from(usersSchema);
  const users = await baseQuery.limit(limit).offset(offset);

  return toManyResult(users);
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