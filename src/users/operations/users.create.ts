import { db } from "../../lib/drizzle";
import { usersTable, UserRoles } from "../user.schema";
import { CreateUserRequest, User } from "../user.schema";
import { findByFingerprint } from "../operations/users.find";

export async function createUser(userData: CreateUserRequest): Promise<User> {
  const user = await findByFingerprint(userData.fingerprint!);
  if (user) {
    return user;
  }
  const [newUser] = await db
    .insert(usersTable)
    .values({
      id: userData.id,
      name: userData.name || null,
      email: userData.email || null,
      password: userData.password || null,
      fingerprint: userData.fingerprint || null,
      userAgent: userData.userAgent || null,
      lastIp: userData.lastIp || null,
      isAnonymous: userData.isAnonymous ?? true,
    })
    .returning();

  return newUser;
}


// @users.create.ts#L1-27 let's add another operation to update user information! Let's look at the @user.schema.ts to add support for onboarding users! We need their age, gender, country and some tiny relative information that'll be optional during registration but can be updated during the onboarding! 