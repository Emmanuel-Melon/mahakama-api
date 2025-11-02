import { db } from "../../lib/drizzle";
import { usersTable } from "../../users/users.schema";
import { type User } from "../../users/users.schema";
import { hashPassword } from "../utils";
import { findUserByEmail } from "./auth.find";
import { registerUserSchema, type RegisterUserAttrs } from "../auth.schema";

export async function registerUser(
  userData: RegisterUserAttrs & { password: string },
): Promise<User> {
  const { email, password, name } = registerUserSchema.parse(userData);

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

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
    .returning();

  return newUser;
}
