import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq, ilike } from "drizzle-orm";
import type { Lawyer } from "../lawyers.types";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export async function findLawyerById(id: string): Promise<DbResult<Lawyer>> {
  const [lawyer] = await db
    .select()
    .from(lawyersTable)
    .where(eq(lawyersTable.id, id))
    .limit(1);
  return toResult(lawyer);
}

export async function findById(id: string): Promise<DbResult<Lawyer>> {
  const [lawyer] = await db
    .select()
    .from(lawyersTable)
    .where(eq(lawyersTable.id, id))
    .limit(1);
  return toResult(lawyer);
}

export async function findByEmail(email: string): Promise<DbResult<Lawyer>> {
  const [lawyer] = await db
    .select()
    .from(lawyersTable)
    .where(ilike(lawyersTable.email, email))
    .limit(1);

  return toResult(lawyer);
}
