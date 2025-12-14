import { db } from "@/lib/drizzle";
import { lawyersTable, type Lawyer } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type { UpdateLawyerInput } from "../lawyers.schema";

export async function updateLawyer(id: number, updateData: UpdateLawyerInput) {
  const updateValues: any = { ...updateData };
  if (updateValues.rating !== undefined) {
    updateValues.rating =
      typeof updateValues.rating === "number"
        ? updateValues.rating.toString()
        : updateValues.rating;

    const [updatedLawyer] = await db
      .update(lawyersTable)
      .set({
        ...updateValues,
        updatedAt: new Date(),
      })
      .where(eq(lawyersTable.id, id))
      .returning();

    return updatedLawyer;
  }
}
