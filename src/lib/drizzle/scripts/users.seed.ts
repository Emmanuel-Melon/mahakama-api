import { faker } from "@faker-js/faker/locale/en";
import { db } from "..";
import { usersSchema, type NewUser } from "../../../users/users.schema";
import { hashPassword } from "../../../auth/auth.utils";
import { UserRoles, Genders } from "../../../users/users.types";

// Helper to get a random element from an array
const randomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

// Helper to get a random role with weighted distribution
const getRandomRole = (index: number): UserRoles => {
  // First 2 users are admins, next 3 are lawyers, rest are regular users
  if (index < 2) return UserRoles.ADMIN;
  if (index < 5) return UserRoles.LAWYER;
  return UserRoles.USER;
};

async function createRandomUser(index: number): Promise<NewUser> {
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
}

const NUMBER_OF_USERS = 20; // Increased to get a good distribution

async function seedUsers() {
  try {
    console.log("Seeding users...");
    await db.delete(usersSchema);
    console.log("Cleared existing users");

    const users = await Promise.all(
      Array.from({ length: NUMBER_OF_USERS }, (_, i) => createRandomUser(i)),
    );

    // Log role distribution for verification
    const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
      const role = user.role || "unknown";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    console.log("Role distribution:", roleCounts);

    const insertedUsers = await db
      .insert(usersSchema)
      .values(users)
      .returning();

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
