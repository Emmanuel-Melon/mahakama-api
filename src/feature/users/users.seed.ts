import { db } from "@/lib/drizzle";
import { usersSchema } from "@/feature/users/users.schema";
import { logger } from "@/lib/logger";
import { createRandomUser } from "./operations/users.create";
import { sql } from "drizzle-orm";

const NUMBER_OF_USERS = 150;

async function seedUsers() {
  try {
    logger.info("Seeding users...");
    // Clear dependent tables first to avoid foreign key violations
    await db.execute(sql`TRUNCATE TABLE "chat_sessions" CASCADE`);
    await db.delete(usersSchema);
    logger.info("Cleared existing users and dependent sessions");

    const users = await Promise.all(
      Array.from({ length: NUMBER_OF_USERS }, (_, i) => createRandomUser(i)),
    );

    const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
      const role = user.role || "unknown";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    const insertedUsers = await db
      .insert(usersSchema)
      .values(users)
      .returning();

    logger.info(`Successfully seeded ${insertedUsers.length} users`);
    logger.info({ insertedUsers }, "Seeded users:");
  } catch (error) {
    logger.error({ error }, "Error seeding users:");
    process.exit(1);
  }
}

async function main() {
  await seedUsers();
  process.exit(0);
}

// main();
