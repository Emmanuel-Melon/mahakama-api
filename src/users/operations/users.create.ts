import { db } from "../../lib/drizzle";
import { usersTable } from "../user.schema";
import { CreateUserRequest, User } from "../user.schema";

export async function createUser(userData: CreateUserRequest): Promise<User> {
  const [newUser] = await db
    .insert(usersTable)
    .values({
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
    })
    .returning();

  return newUser;
}
