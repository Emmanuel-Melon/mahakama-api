import { db } from "@/lib/drizzle";
import { usersSchema } from "../users.schema";
import { User } from "../users.schema";
import { GetUsersQuery } from "../users.types";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { 
  PaginationQueryParams, 
  BaseSortParams, 
  BaseFilterParams,
  SortDirection
} from "@/lib/express/express.types";
import { getPaginationParams, getSortConfig } from "@/lib/express/pagination";
import { checkUserRole } from "@/feature/auth/auth.utils";

type FindAllOptions = GetUsersQuery;

export async function findAll(options?: FindAllOptions): Promise<{ 
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
    defaultLimit: 10
  });

  const conditions = [];

  if (options?.role && checkUserRole(options.role)) {
    conditions.push(eq(usersSchema.role, options.role));
  }
  const search = (options as BaseFilterParams)?.search;
  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push(
      or(
        ilike(usersSchema.name, searchTerm),
        ilike(usersSchema.email, searchTerm)
      )
    );
  }
  const baseQuery = db.select().from(usersSchema);
  const queryWithConditions = conditions.length > 0 
    ? baseQuery.where(and(...conditions)) 
    : baseQuery;

  const countResult = await (conditions.length > 0 
    ? db.select({ count: sql<number>`count(*)` }).from(usersSchema).where(and(...conditions))
    : db.select({ count: sql<number>`count(*)` }).from(usersSchema));
    
  const total = Number(countResult[0]?.count || 0);

  const sortableFields = ['createdAt', 'updatedAt', 'name', 'email'] as const;
  type SortableField = typeof sortableFields[number];
  
  const { field: sortField, direction: sortDirection } = getSortConfig({
    sortBy: options?.sortBy,
    order: (options as BaseSortParams)?.order,
    validFields: sortableFields,
    defaultField: 'createdAt',
    defaultDirection: 'desc'
  });
  
  const users = await queryWithConditions
    .orderBy(sortDirection === 'asc' 
      ? asc(usersSchema[sortField]) 
      : desc(usersSchema[sortField]))
    .limit(limit)
    .offset(offset);

  return { 
    users, 
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
    hasNext: page * limit < total,
    hasPrevious: page > 1
  };
}