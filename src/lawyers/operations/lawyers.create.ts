import { db } from "../../lib/drizzle";
import { lawyersTable } from "../lawyer.schema";
import type { CreateLawyerInput } from "../lawyer.schema";
import type { Lawyer } from "../lawyer.schema";

export async function createLawyer(
  lawyerData: CreateLawyerInput,
): Promise<Lawyer> {
  // Prepare the data for insertion
  const insertData = {
    ...lawyerData,
    casesHandled: lawyerData.casesHandled ?? 0,
    isAvailable: lawyerData.isAvailable ?? true,
    // Ensure rating is either a string or null (not undefined)
    rating: lawyerData.rating ?? "0",
  };

  const [newLawyer] = await db
    .insert(lawyersTable)
    .values(insertData)
    .returning();

  return newLawyer;
}
