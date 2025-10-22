import { db } from "../../lib/drizzle";
import { usersTable } from "../user.schema";
import { User } from "../user.schema";

export async function findAll(): Promise<User[]> {
  const dbUsers = await db.select().from(usersTable);

  return dbUsers;
}
