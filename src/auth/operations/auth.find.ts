import { db } from "../../lib/drizzle";
import { usersTable, type User } from "../../users/users.schema";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return user || null;
};

export const findUserById = async (userId: string): Promise<User | null> => {
  if (!userId) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  return user || null;
};
