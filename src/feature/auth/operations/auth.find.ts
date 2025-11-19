import { db } from "../../lib/drizzle";
import { usersSchema, type User } from "../../users/users.schema";
import { eq } from "drizzle-orm";

export type UserWithPassword = User & {
  password: string | null;
};

export const findUserByEmail = async (
  email: string,
): Promise<UserWithPassword | null> => {
  const [user] = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.email, email))
    .limit(1);

  return user || null;
};

export const findUserById = async (userId: string): Promise<User | null> => {
  if (!userId) return null;
  const [user] = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.id, userId))
    .limit(1);

  return user || null;
};
