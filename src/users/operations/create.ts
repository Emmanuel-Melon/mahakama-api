import { db } from "../../lib/drizzle";
import { usersTable } from "../user.schema";
import { User } from "../user.types";
import bcrypt from "bcryptjs";
import { CreateUserRequest } from "../user.schema";

export async function createUser(userData: CreateUserRequest): Promise<User> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const [newUser] = await db
    .insert(usersTable)
    .values({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user",
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role as "user" | "admin",
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
}
