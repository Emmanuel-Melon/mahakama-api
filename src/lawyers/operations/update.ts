import { db } from "../../lib/drizzle";
import { lawyersTable } from "../lawyer.schema";
import { eq } from "drizzle-orm";
import type { UpdateLawyerInput } from "../lawyer.schema";

export async function updateLawyer(id: number, updateData: UpdateLawyerInput) {
  // Prepare the update data, handling the rating conversion if present
  const updateValues: any = { ...updateData };

  if (updateValues.rating !== undefined) {
    updateValues.rating =
      typeof updateValues.rating === "number"
        ? updateValues.rating.toString()
        : updateValues.rating;
  }

  const [updatedLawyer] = await db
    .update(lawyersTable)
    .set({
      ...updateValues,
      updatedAt: new Date(),
    })
    .where(eq(lawyersTable.id, id))
    .returning();

  if (!updatedLawyer) {
    return null;
  }

  return {
    ...updatedLawyer,
    // Convert rating back to number for the API response
    rating: parseFloat(updatedLawyer.rating),
  };
}
