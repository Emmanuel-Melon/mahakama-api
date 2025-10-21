import { db } from "../../lib/drizzle";
import { lawyersTable } from "../lawyer.schema";
import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import type { Lawyer } from "../lawyer.types";

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
  [key: string]: unknown; // Allow additional properties
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

  // Build where conditions
  const conditions = [];

  // Default to only show available lawyers
  conditions.push(eq(lawyersTable.isAvailable, true));

  // Search condition (name, email, or specialization)
  if (search) {
    conditions.push(
      or(
        ilike(lawyersTable.name, `%${search}%`),
        ilike(lawyersTable.email, `%${search}%`),
        ilike(lawyersTable.specialization, `%${search}%`),
      ),
    );
  }

  // Filter by specialization
  if (specialization) {
    conditions.push(ilike(lawyersTable.specialization, `%${specialization}%`));
  }

  // Filter by experience range
  if (minExperience !== undefined) {
    conditions.push(gte(lawyersTable.experienceYears, minExperience));
  }
  if (maxExperience !== undefined) {
    conditions.push(lte(lawyersTable.experienceYears, maxExperience));
  }

  // Filter by minimum rating
  if (minRating !== undefined) {
    conditions.push(sql`CAST(${lawyersTable.rating} AS FLOAT) >= ${minRating}`);
  }

  // Filter by location
  if (location) {
    conditions.push(ilike(lawyersTable.location, `%${location}%`));
  }

  // Filter by language (case-insensitive search in the languages array)
  if (language) {
    conditions.push(
      sql`LOWER(${lawyersTable.languages}::text) LIKE LOWER(${"%" + language + "%"})`,
    );
  }

  // Get total count for pagination
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(lawyersTable)
    .where(and(...conditions));

  const total = Number(countResult[0]?.count || 0);
  const totalPages = Math.ceil(total / limit);

  // Map sortBy to actual column names if needed
  const sortColumnMap: Record<string, string> = {
    createdAt: "created_at",
    updatedAt: "updated_at",
    experienceYears: "experience_years",
    isAvailable: "is_available",
    casesHandled: "cases_handled",
    // Add other mappings if needed
  };

  const dbSortBy = sortColumnMap[sortBy] || sortBy;

  // Get paginated results
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
    data: dbLawyers.map((lawyer) => ({
      ...lawyer,
      rating: parseFloat(lawyer.rating),
    })),
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
