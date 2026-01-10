import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import type { Lawyer } from "../lawyers.types";
import type { LawyerFilters } from "../lawyers.types";

export async function findAll(filters?: LawyerFilters): Promise<Lawyer[]> {
  const conditions = [];

  if (filters?.specialization) {
    conditions.push(eq(lawyersTable.specialization, filters.specialization));
  }

  if (filters?.location) {
    conditions.push(eq(lawyersTable.location, filters.location));
  }

  if (filters?.isAvailable !== undefined) {
    conditions.push(eq(lawyersTable.isAvailable, filters.isAvailable));
  }

  if (filters?.q) {
    const search = `%${filters.q}%`;

    conditions.push(
      or(
        ilike(lawyersTable.name, search),
        ilike(lawyersTable.specialization, search),
        ilike(lawyersTable.location, search),
        ilike(lawyersTable.email, search),
      ),
    );
  }

  return db
    .select()
    .from(lawyersTable)
    .where(conditions.length ? and(...conditions) : undefined);
}
