import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import type { Lawyer } from "../lawyers.schema";

const sortColumnMap: Record<string, string> = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  experienceYears: "experience_years",
  isAvailable: "is_available",
  casesHandled: "cases_handled",
};

export async function findAll(): Promise<Lawyer[]> {
  const lawyers = await db.select().from(lawyersTable);

  return lawyers;
}
