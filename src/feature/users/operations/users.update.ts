import { db } from "@/lib/drizzle";
import { usersSchema, type UserRole } from "../users.schema";
import type { NewUser, User } from "../users.types";
import { eq } from "drizzle-orm";
import { findById } from "./users.find";

export async function updateUser(
  userId: string,
  userAttrs: NewUser,
): Promise<User | null> {
  const userExists = await findById(userId);
  const [user] = await db
    .update(usersSchema)
    .set({
      ...userAttrs,
      updatedAt: new Date(),
      role: userAttrs.role as UserRole,
    })
    .where(eq(usersSchema.id, userId))
    .returning();
  return user;
}
