import { db } from "../../lib/drizzle";
import { lawyersTable } from "../lawyer.schema";
import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import type { Lawyer } from "../lawyer.schema";

export interface FindAllOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof Lawyer;
  sortOrder?: "asc" | "desc";
  search?: string;
  specialization?: string;
  minExperience?: number;
  maxExperience?: number;
  minRating?: number;
  location?: string;
  language?: string;
  [key: string]: unknown;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function findAll(
  options: FindAllOptions = {},
): Promise<PaginatedResult<Lawyer>> {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    specialization,
    minExperience,
    maxExperience,
    minRating,
    location,
    language,
  } = options;

  const offset = (page - 1) * limit;

  const conditions = [];

  conditions.push(eq(lawyersTable.isAvailable, true));

  if (search) {
    conditions.push(
      or(
        ilike(lawyersTable.name, `%${search}%`),
        ilike(lawyersTable.email, `%${search}%`),
        ilike(lawyersTable.specialization, `%${search}%`),
      ),
    );
  }

  if (specialization) {
    conditions.push(ilike(lawyersTable.specialization, `%${specialization}%`));
  }
  if (minExperience !== undefined) {
    conditions.push(gte(lawyersTable.experienceYears, minExperience));
  }
  if (maxExperience !== undefined) {
    conditions.push(lte(lawyersTable.experienceYears, maxExperience));
  }

  if (minRating !== undefined) {
    conditions.push(sql`CAST(${lawyersTable.rating} AS FLOAT) >= ${minRating}`);
  }
  if (location) {
    conditions.push(ilike(lawyersTable.location, `%${location}%`));
  }

  if (language) {
    conditions.push(
      sql`LOWER(${lawyersTable.languages}::text) LIKE LOWER(${"%" + language + "%"})`,
    );
  }

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(lawyersTable)
    .where(and(...conditions));

  const total = Number(countResult[0]?.count || 0);
  const totalPages = Math.ceil(total / limit);

  const sortColumnMap: Record<string, string> = {
    createdAt: "created_at",
    updatedAt: "updated_at",
    experienceYears: "experience_years",
    isAvailable: "is_available",
    casesHandled: "cases_handled",
  };

  const dbSortBy = sortColumnMap[sortBy] || sortBy;
  const dbLawyers = await db
    .select()
    .from(lawyersTable)
    .where(and(...conditions))
    .orderBy(
      sortOrder === "asc"
        ? sql.raw(`"${dbSortBy}" ASC NULLS LAST`)
        : sql.raw(`"${dbSortBy}" DESC NULLS LAST`),
    )
    .limit(limit)
    .offset(offset);

  return {
    data: dbLawyers,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
