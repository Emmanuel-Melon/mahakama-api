import { db } from "../../lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq, ilike } from "drizzle-orm";
import type { Lawyer } from "../lawyers.schema";

export async function findById(id: number): Promise<Lawyer> {
  const [lawyer] = await db
    .select()
    .from(lawyersTable)
    .where(eq(lawyersTable.id, id))
    .limit(1);

  return lawyer;
}

export async function findByEmail(email: string): Promise<Lawyer> {
  const [lawyer] = await db
    .select()
    .from(lawyersTable)
    .where(ilike(lawyersTable.email, email))
    .limit(1);

  return lawyer;
}
