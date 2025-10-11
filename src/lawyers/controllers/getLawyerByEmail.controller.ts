import { Request, Response } from "express";
import { findByEmail } from "../operations/find";
import { lawyerResponseSchema } from "../lawyer.schema";

export const getLawyerByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Email query parameter is required" });
    }

    const lawyer = await findByEmail(email as string);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    // Validate response data against schema
    const validatedLawyer = lawyerResponseSchema.parse(lawyer);
    return res.status(200).json(validatedLawyer);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch lawyer by email",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
