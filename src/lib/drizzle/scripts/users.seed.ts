import { faker } from "@faker-js/faker";
import { db } from "..";
import { usersTable, type NewUser } from "../../../users/user.schema";
import { hashPassword } from "../../../auth/utils";

async function createRandomUser(): Promise<NewUser> {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await hashPassword("test-password"),
  };
}

const NUMBER_OF_USERS = 10;

async function seedUsers() {
  try {
    console.log("Seeding users...");
    await db.delete(usersTable);
    console.log("Cleared existing users");

    const users = await Promise.all(
      Array.from({ length: NUMBER_OF_USERS }, () => createRandomUser()),
    );

    const insertedUsers = await db.insert(usersTable).values(users).returning();

    console.log(`Successfully seeded ${insertedUsers.length} users`);
    console.log("Seeded users:", insertedUsers);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

async function main() {
  await seedUsers();
  process.exit(0);
}

main();
