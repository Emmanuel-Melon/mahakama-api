import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import type { CreateLawyerInput, NewLawyer } from "../lawyers.schema";
import type { Lawyer } from "../lawyers.schema";
import { faker } from "@faker-js/faker";
import { randomElement } from "@/lib/drizzle/seed";
import {
  locations,
  legalSpecializations,
  commonLanguages,
} from "../lawyers.config";

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

export const createRandomLawyer = (): Omit<
  NewLawyer,
  "id" | "createdAt" | "updatedAt"
> => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({
    firstName,
    lastName,
    provider: "lawfirm.com",
  });

  const location = randomElement(locations);

  return {
    name: `${firstName} ${lastName}`,
    email: email.toLowerCase(),
    specialization: randomElement(legalSpecializations),
    experienceYears: faker.number.int({ min: 3, max: 25 }),
    rating: faker.number
      .float({ min: 3.5, max: 5.0, fractionDigits: 1 })
      .toFixed(1),
    casesHandled: faker.number.int({ min: 50, max: 500 }),
    isAvailable: faker.datatype.boolean({ probability: 0.8 }), // 80% chance of being available
    location: `${location.city}, ${location.country}`,
    languages: randomElement(commonLanguages),
  };
};
