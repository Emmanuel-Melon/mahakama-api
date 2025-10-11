import { Request, Response } from "express";
import { findById } from "../operations/find";
import { lawyerResponseSchema } from "../lawyer.schema";

export const getLawyerById = async (req: Request, res: Response) => {
  try {
    const lawyerId = parseInt(req.params.id);
    const lawyer = await findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    // Validate response data against schema
    const validatedLawyer = lawyerResponseSchema.parse(lawyer);
    return res.status(200).json(validatedLawyer);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch lawyer",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
