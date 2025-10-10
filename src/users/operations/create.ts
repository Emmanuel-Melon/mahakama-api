import { db } from "../../lib/drizzle";
import { usersTable } from "../user.schema";
import { NewUser, User } from "../user.types";

export async function createUser(userData: NewUser): Promise<User> {
  const [newUser] = await db
    .insert(usersTable)
    .values({
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
    })
    .returning();

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role as "user" | "admin",
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
}
