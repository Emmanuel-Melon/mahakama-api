import { db } from "../../lib/drizzle";
import { usersTable } from "../users.schema";
import { CreateUserRequest, User } from "../users.schema";
import { findByFingerprint } from "../operations/users.find";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export async function createUser(userData: CreateUserRequest): Promise<User> {
  const user = await findByFingerprint(userData.fingerprint!);
  if (user) {
    return user;
  }
  const [newUser] = await db
    .insert(usersTable)
    .values({
      id: uuid(),
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

export async function createRandomUser(): Promise<
  Pick<User, "id" | "email" | "name">
> {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
  };
}
