import { db } from "../../lib/drizzle";
import { usersTable } from "../users.schema";
import { User } from "../users.schema";
import { GetUsersQuery } from "../users.types";
import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";

const sortColumnMap: Record<string, string> = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  experienceYears: "experience_years",
  isAvailable: "is_available",
  casesHandled: "cases_handled",
};

export async function findAll(options?: GetUsersQuery): Promise<User[]> {
  const dbUsers = await db.select().from(usersTable);
  return dbUsers;
}
