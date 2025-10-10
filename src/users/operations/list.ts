import { db } from "../../lib/drizzle";
import { usersTable } from "../user.schema";
import { User } from "../user.types";

export async function findAll(): Promise<User[]> {
  const dbUsers = await db.select().from(usersTable);

  // Map database users to the User type
  return dbUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as "user" | "admin",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
}
