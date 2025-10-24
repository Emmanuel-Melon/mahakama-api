import { db } from "../../lib/drizzle";
import { usersTable } from "../user.schema";
import { eq, ilike } from "drizzle-orm";
import type { User } from "../user.schema";

export async function findById(id: string): Promise<User> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user;
}

export async function findByEmail(email: string): Promise<User> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(ilike(usersTable.email, email))
    .limit(1);

  return user;
}

export async function findByFingerprint(fingerprint: string): Promise<User> {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.fingerprint, fingerprint));

  console.log("user", user);

  return user[0];
}

interface FindOrCreateUserParams {
  fingerprint: string;
  userAgent?: string;
  ip?: string;
}

export const findOrCreateUser = async ({
  fingerprint,
  userAgent,
  ip,
}: FindOrCreateUserParams) => {
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.fingerprint, fingerprint))
    .limit(1);

  if (existingUser) {
    return existingUser;
  }

  // Create new user if not found
  const [newUser] = await db
    .insert(usersTable)
    .values({
      fingerprint,
      userAgent,
      lastIp: ip,
      isAnonymous: true,
    })
    .returning();

  return newUser;
};
