import { db } from "@/lib/drizzle";
import { usersSchema, type UserWithChats } from "../users.schema";
import { eq, ilike } from "drizzle-orm";
import type { User } from "../users.schema";
import { chatsSchema } from "@/feature/chats/chats.schema";

export async function findUserById(id: string): Promise<UserWithChats | null> {
  const user = await db.query.usersSchema.findFirst({
    where: eq(usersSchema.id, id),
    with: {
      chats: true,
    },
  });
  return user || null;
}

export async function findById(id: string): Promise<UserWithChats | null> {
  const user = await findUserById(id);

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
