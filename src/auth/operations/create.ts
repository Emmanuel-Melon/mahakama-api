import { db } from "../../lib/drizzle";
import { usersTable } from "../../users/user.schema";

import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { CreateUserInput } from "../../users/user.schema";

export async function createUser(
  userData: CreateUserInput & { password: string },
): Promise<{
  id: number;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  const { email, password, name } = userData;

  if (!email) {
    throw new Error("Email is required");
  }

  if (name === undefined) {
    throw new Error("Name is required");
  }

  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const [newUser] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    });

  return newUser;
}
