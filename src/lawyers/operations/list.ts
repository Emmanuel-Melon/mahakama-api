import { db } from '../../lib/drizzle';
import { lawyersTable } from '../lawyer.schema';
import { eq } from 'drizzle-orm';
import type { Lawyer } from '../lawyer.types';

export async function findAll(): Promise<Lawyer[]> {
  const dbLawyers = await db
    .select()
    .from(lawyersTable)
    .where(eq(lawyersTable.isAvailable, true));

  return dbLawyers.map(lawyer => ({
    ...lawyer,
    // Convert rating back to number for the API response
    rating: parseFloat(lawyer.rating)
  }));
}