import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import type { CreateLawyerInput } from "../lawyers.schema";
import type { Lawyer } from "../lawyers.schema";
import { faker } from "@faker-js/faker";
import { createRandomUser } from "@/feature/users/operations/users.create";

export async function createLawyer(
  lawyerData: CreateLawyerInput,
): Promise<Lawyer | null> {
  const insertData = {
    ...lawyerData,
    casesHandled: lawyerData.casesHandled ?? 0,
    isAvailable: lawyerData.isAvailable ?? true,
    rating: lawyerData.rating ?? "0",
  };
  const [newLawyer] = await db
    .insert(lawyersTable)
    .values(insertData)
    .returning();
  return newLawyer;
}

export async function createRandomLawyer(): Promise<Lawyer> {
  const randomUser = await createRandomUser();
  return {
    name: randomUser.name!,
    email: randomUser.email!,
    specialization: "Criminal Law",
    experienceYears: Number(faker.number),
    location: faker.location.country(),
    languages: ["English", "Swahili"],
    // @ts-ignore
    rating: Number(faker.number),
    casesHandled: Number(faker.number),
    isAvailable: true,
  };
}
