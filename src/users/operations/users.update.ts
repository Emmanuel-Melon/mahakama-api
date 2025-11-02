import { db } from "../../lib/drizzle";
import { usersTable } from "../users.schema";
import { UserAttrs, User, UserRoles } from "../users.schema";
import { eq } from "drizzle-orm";
import { findById } from "./users.find";

export async function updateUser(
  userId: string,
  userData: Omit<UserAttrs, "password">,
): Promise<User | null> {
  try {
    const userExists = await findById(userId);
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        ...userData,
        updatedAt: new Date(),
        role: userData.role as UserRoles,
      })
      .where(eq(usersTable.id, userId))
      .returning();

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}
