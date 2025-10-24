import "dotenv/config";
import { db } from "..";
import { lawyersTable, type NewLawyer } from "../../../lawyers/lawyer.schema";

const lawyerData: Array<Omit<NewLawyer, "id" | "createdAt" | "updatedAt">> = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@lawfirm.com",
    specialization: "Corporate Law",
    experienceYears: 10,
    rating: "4.8",
    casesHandled: 245,
    isAvailable: true,
    location: "Nairobi",
    languages: ["English", "Swahili", "French"],
  },
  {
    name: "Michael Omondi",
    email: "michael.omondi@lawfirm.com",
    specialization: "Criminal Law",
    experienceYears: 15,
    rating: "4.9",
    casesHandled: 320,
    isAvailable: true,
    location: "Mombasa",
    languages: ["English", "Swahili"],
  },
  {
    name: "Amina Mohammed",
    email: "amina.mohammed@lawfirm.com",
    specialization: "Family Law",
    experienceYears: 8,
    rating: "4.7",
    casesHandled: 180,
    isAvailable: false,
    location: "Nakuru",
    languages: ["English", "Swahili", "Arabic"],
  },
];

async function seedLawyers() {
  try {
    console.log("Seeding lawyers...");

    // Clear existing data
    await db.delete(lawyersTable);
    console.log("Cleared existing lawyers");

    // Insert mock lawyers
    const insertedLawyers = await db
      .insert(lawyersTable)
      .values(lawyerData)
      .returning();

    console.log(`Successfully seeded ${insertedLawyers.length} lawyers`);
    console.log("Seeded lawyers:", insertedLawyers);
  } catch (error) {
    console.error("Error seeding lawyers:", error);
    process.exit(1);
  }
}

async function main() {
  await seedLawyers();
  process.exit(0);
}

main();
