import { spawn } from "child_process";
import { glob } from "glob";
import { logger } from "@/lib/logger";

export const randomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

async function getSeedFiles(): Promise<string[]> {
  try {
    const files = await glob("src/feature/**/*.seed.ts", {
      cwd: process.cwd(),
    });
    return files.sort();
  } catch (error) {
    logger.error({ error }, "Error finding seed files:");
    process.exit(1);
  }
}

async function runSeed(seedFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    logger.info(`\n🌱 Running ${seedFile}...`);
    const child = spawn("tsx", [seedFile], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    child.on("close", (code) => {
      if (code === 0) {
        logger.info(`✅ ${seedFile} completed successfully`);
        resolve();
      } else {
        reject(new Error(`Seed ${seedFile} failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    logger.info("🚀 Starting database seeding...");
    const seedFiles = await getSeedFiles();
    if (seedFiles.length === 0) {
      logger.info("⚠️  No seed files found");
      process.exit(0);
    }
    logger.info(`📋 Found ${seedFiles.length} seed files:`);
    seedFiles.forEach((file) => logger.info(`   - ${file}`));

    for (const seedFile of seedFiles) {
      await runSeed(seedFile);
    }
    logger.info("\n🎉 All seeds completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "\n💥 Seeding failed:");
    process.exit(1);
  }
}

// main(); 