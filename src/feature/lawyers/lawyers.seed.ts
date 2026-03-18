import "dotenv/config";
import { db } from "@/lib/drizzle";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import { createMockLawyer } from "./lawyers.factory";
import { logger } from "@/lib/logger";
import type { NewLawyer } from "@/feature/lawyers/lawyers.types";
const NUMBER_OF_LAWYERS = 150;

async function seedLawyers() {
  try {
    await db.delete(lawyersTable);

    // Create mock lawyers and convert to NewLawyer format (without id, createdAt, updatedAt)
    const mockLawyers = Array.from({ length: NUMBER_OF_LAWYERS }, () =>
      createMockLawyer(),
    );
    const lawyers: NewLawyer[] = mockLawyers.map(
      ({ id, createdAt, updatedAt, ...lawyer }) => lawyer,
    );

    const specializationCounts = lawyers.reduce<Record<string, number>>(
      (acc, lawyer) => {
        const spec = lawyer.specialization;
        acc[spec] = (acc[spec] || 0) + 1;
        return acc;
      },
      {},
    );
    const availableCount = lawyers.filter((l) => l.isAvailable).length;
    const insertedLawyers = await db
      .insert(lawyersTable)
      .values(lawyers)
      .returning();
    logger.info(`Successfully seeded ${insertedLawyers.length} lawyers`);
    logger.info(
      {
        insertedLawyers,
        availableCount,
        specializationCounts,
      },
      "Seeded lawyers",
    );
  } catch (error) {
    logger.error({ error }, "Error seeding lawyers");
    process.exit(1);
  }
}

async function main() {
  await seedLawyers();
  process.exit(0);
}

// main();
