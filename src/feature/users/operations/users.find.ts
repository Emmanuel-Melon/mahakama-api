import { db } from "../../lib/drizzle";
import { usersSchema } from "../users.schema";
import { eq, ilike } from "drizzle-orm";
import type { User } from "../users.schema";

export async function findById(id: string): Promise<User> {
  const [user] = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.id, id))
    .limit(1);
  return user;
}

export async function findByEmail(email: string): Promise<User> {
  const [user] = await db
    .select()
    .from(usersSchema)
    .where(ilike(usersSchema.email, email))
    .limit(1);

  return user;
}

export async function findByFingerprint(fingerprint: string): Promise<User> {
  const user = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.fingerprint, fingerprint));

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
    .from(usersSchema)
    .where(eq(usersSchema.fingerprint, fingerprint))
    .limit(1);

  if (existingUser) {
    return existingUser;
  }

  // Create new user if not found
  const [newUser] = await db
    .insert(usersSchema)
    .values({
      fingerprint,
      userAgent,
      lastIp: ip,
      isAnonymous: true,
    })
    .returning();

  return newUser;
};
