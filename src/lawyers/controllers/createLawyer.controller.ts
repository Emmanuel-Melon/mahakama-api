import { Request, Response, NextFunction } from "express";
import { db } from "../../lib/drizzle";
import { createLawyer } from "../operations/create";
import { lawyersTable } from "../lawyer.schema";
import { eq } from "drizzle-orm";
import { createLawyerSchema } from "../lawyer.schema";

export const createLawyerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate request body against schema
    const validationResult = createLawyerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.format(),
      });
    }

    const lawyerData = validationResult.data;

    // Check if lawyer with the same email already exists
    const [existingLawyer] = await db
      .select()
      .from(lawyersTable)
      .where(eq(lawyersTable.email, lawyerData.email))
      .limit(1);

    if (existingLawyer) {
      return res.status(400).json({
        error: "A lawyer with this email already exists",
      });
    }

    const newLawyer = await createLawyer(lawyerData);
    res.status(201).json({
      success: true,
      data: newLawyer,
    });
  } catch (error) {
    next(error);
  }
};
