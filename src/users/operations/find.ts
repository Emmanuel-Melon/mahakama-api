import { db } from "../../lib/drizzle";
import { usersTable } from "../user.schema";
import { eq, ilike } from "drizzle-orm";
import type { User } from "../user.types";

export async function findById(id: number): Promise<User | undefined> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  return user
    ? {
        ...user,
        role: user.role as "user" | "admin",
      }
    : undefined;
}

export async function findByEmail(email: string): Promise<User | undefined> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(ilike(usersTable.email, email))
    .limit(1);

  return user
    ? {
        ...user,
        role: user.role as "user" | "admin",
      }
    : undefined;
}
