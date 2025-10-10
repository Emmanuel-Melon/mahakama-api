import { db } from '../../lib/drizzle';
import { lawyersTable } from '../lawyer.schema';
import { eq, ilike } from 'drizzle-orm';
import type { Lawyer } from '../lawyer.types';

export async function findById(id: number): Promise<Lawyer | undefined> {
  const [lawyer] = await db
    .select()
    .from(lawyersTable)
    .where(eq(lawyersTable.id, id))
    .limit(1);

  if (!lawyer) return undefined;

  return {
    ...lawyer,
    rating: parseFloat(lawyer.rating)
  };
}

export async function findByEmail(email: string): Promise<Lawyer | undefined> {
  const [lawyer] = await db
    .select()
    .from(lawyersTable)
    .where(ilike(lawyersTable.email, email))
    .limit(1);

  if (!lawyer) return undefined;

  return {
    ...lawyer,
    rating: parseFloat(lawyer.rating)
  };
}
