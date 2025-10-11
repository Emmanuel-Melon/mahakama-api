import { Request, Response } from "express";
import { findAll } from "../operations/list";
import { lawyerResponseSchema } from "../lawyer.schema";

export const getLawyers = async (req: Request, res: Response) => {
  try {
    const lawyers = await findAll();
    // Validate response data against schema
    const validatedLawyers = lawyers.map(lawyer => 
      lawyerResponseSchema.parse(lawyer)
    );
    return res.status(200).json(validatedLawyers);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch lawyers",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
