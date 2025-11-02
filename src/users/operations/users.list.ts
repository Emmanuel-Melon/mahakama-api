import { db } from "../../lib/drizzle";
import { usersTable } from "../users.schema";
import { User } from "../users.schema";

export async function findAll(): Promise<User[]> {
  const dbUsers = await db.select().from(usersTable);

  return dbUsers;
}
