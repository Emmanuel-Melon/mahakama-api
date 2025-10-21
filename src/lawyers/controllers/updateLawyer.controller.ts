import { Request, Response } from "express";
import { db } from "../../lib/drizzle";
import { updateLawyer } from "../operations/update";
import { lawyersTable } from "../lawyer.schema";
import { eq, and, not } from "drizzle-orm";
import { updateLawyerSchema } from "../lawyer.schema";

export const updateLawyerHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lawyerId = parseInt(id, 10);

    if (isNaN(lawyerId)) {
      return res.status(400).json({ error: "Invalid lawyer ID" });
    }

    // Validate request body against schema
    const validationResult = updateLawyerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.format(),
      });
    }

    const updateData = validationResult.data;

    // Check if lawyer exists
    const [existingLawyer] = await db
      .select()
      .from(lawyersTable)
      .where(eq(lawyersTable.id, lawyerId))
      .limit(1);

    if (!existingLawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    // If email is being updated, check if it's already in use
    if (updateData.email && updateData.email !== existingLawyer.email) {
      const [emailInUse] = await db
        .select()
        .from(lawyersTable)
        .where(
          and(
            eq(lawyersTable.email, updateData.email),
            not(eq(lawyersTable.id, lawyerId)),
          ),
        )
        .limit(1);

      if (emailInUse) {
        return res.status(400).json({
          error: "Email is already in use by another lawyer",
        });
      }
    }

    const updatedLawyer = await updateLawyer(lawyerId, updateData);

    if (!updatedLawyer) {
      return res.status(404).json({ error: "Failed to update lawyer" });
    }

    res.json({
      success: true,
      data: updatedLawyer,
    });
  } catch (error) {
    console.error("Error updating lawyer:", error);
    res.status(500).json({ error: "Failed to update lawyer" });
  }
};
