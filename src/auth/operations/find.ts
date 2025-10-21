import { db } from "../../lib/drizzle";
import { usersTable } from "../../users/user.schema";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return user || null;
};

export const findUserById = async (userId: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(userId)))
    .limit(1);

  return user || null;
};
