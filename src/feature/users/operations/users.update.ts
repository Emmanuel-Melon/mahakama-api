import { db } from "@/lib/drizzle";
import { usersSchema } from "../users.schema";
import { UserAttrs, type UserRole, type User } from "../users.schema";
import { eq } from "drizzle-orm";
import { findById } from "./users.find";

export async function updateUser(
  userId: string,
  userAttrs: User,
): Promise<User | null> {
  const userExists = await findById(userId);
  const [updatedUser] = await db
    .update(usersSchema)
    .set({
      ...userAttrs,
      updatedAt: new Date(),
      role: userAttrs.role as UserRole,
    })
    .where(eq(usersSchema.id, userId))
    .returning();
  return updatedUser;
}
