import "dotenv/config";
import { db } from "@/lib/drizzle";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import { createRandomLawyer } from "@/feature/lawyers/operations/lawyers.create";
import { logger } from "@/lib/logger";
const NUMBER_OF_LAWYERS = 150;

async function seedLawyers() {
  try {
    await db.delete(lawyersTable);
    const lawyers = await Promise.all(
      Array.from({ length: NUMBER_OF_LAWYERS }, () => createRandomLawyer()),
    );
    const specializationCounts = lawyers.reduce<Record<string, number>>((acc, lawyer) => {
      const spec = lawyer.specialization;
      acc[spec] = (acc[spec] || 0) + 1;
      return acc;
    }, {});
    const availableCount = lawyers.filter(l => l.isAvailable).length;
    const insertedLawyers = await db
      .insert(lawyersTable)
      .values(lawyers)
      .returning();
    logger.info(`Successfully seeded ${insertedLawyers.length} lawyers`);
    logger.info({
      insertedLawyers,
      availableCount,
      specializationCounts,
    }, "Seeded lawyers");
  } catch (error) {
    logger.error({ error }, "Error seeding lawyers");
    process.exit(1);
  }
}

async function main() {
  await seedLawyers();
  process.exit(0);
}

main();
