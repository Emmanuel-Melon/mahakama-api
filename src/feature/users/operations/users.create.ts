import { db } from "@/lib/drizzle";
import { usersSchema } from "../users.schema";
import { User, NewUser } from "../users.types";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { hashPassword } from "@/feature/auth/auth.utils";
import { randomElement } from "@/lib/drizzle/seed";
import { Genders } from "../users.types";
import { getRandomRole } from "../users.utils";

export async function createUser(userData: NewUser): Promise<User> {
  const [user] = await db
    .insert(usersSchema)
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

  return user;
}

export const createRandomUser = async (index: number): Promise<NewUser> => {
  const gender = randomElement(Object.values(Genders));
  const firstName = faker.person.firstName(gender as any);
  const lastName = faker.person.lastName();
  const email = faker.internet.email({
    firstName,
    lastName,
    provider: "example.com",
  });

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: email.toLowerCase(),
    password: await hashPassword("test-password"),
    role: getRandomRole(index),
    age: faker.number.int({ min: 18, max: 80 }),
    gender,
    country: faker.location.country(),
    city: faker.location.city(),
    occupation: faker.person.jobTitle(),
    bio: faker.lorem.paragraphs(2),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent({ days: 30 }),
  };
};
