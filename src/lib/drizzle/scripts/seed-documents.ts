import "dotenv/config";
import { db } from "..";
import { documentsTable } from "../../../documents/document.schema";

const documentData = [
  {
    title: "Landlord and Tenant Act 2022",
    description:
      "An Act to provide for the relationship between landlords and tenants, the responsibilities of each party, and the resolution of disputes arising from tenancy agreements in Uganda.",
    type: "Act",
    sections: 120,
    lastUpdated: "2022",
    storageUrl:
      "https://otjbvofzuukzoixvbypm.supabase.co/storage/v1/object/public/dev/Landlord%20Tenant%20Act%20-%202022.pdf",
  },
  {
    title: "The Constitution of Uganda",
    description:
      "The supreme law of the Republic of Uganda, establishing the country as a sovereign state, defining its structure, and guaranteeing fundamental rights and freedoms.",
    type: "Constitution",
    sections: 289,
    lastUpdated: "1995",
    storageUrl:
      "https://otjbvofzuukzoixvbypm.supabase.co/storage/v1/object/public/dev/The%20Constitution%20of%20Uganda.pdf",
  },
];

async function seedDocuments() {
  try {
    console.log("Seeding documents...");

    // Clear existing data
    await db.delete(documentsTable);
    console.log("Cleared existing documents");

    // Insert documents
    const insertedDocuments = await db
      .insert(documentsTable)
      .values(documentData)
      .returning();

    console.log(`Successfully seeded ${insertedDocuments.length} documents`);
    console.log("Seeded documents:", insertedDocuments);
  } catch (error) {
    console.error("Error seeding documents:", error);
    process.exit(1);
  }
}

async function main() {
  await seedDocuments();
  process.exit(0);
}

main();
