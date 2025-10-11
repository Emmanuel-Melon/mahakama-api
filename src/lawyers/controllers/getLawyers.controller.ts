import { Request, Response, NextFunction } from "express";
import { findAll } from "../operations/list";
import { lawyerResponseSchema } from "../lawyer.schema";
import { ApiError } from "../../middleware/errors";

export const getLawyers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const lawyers = await findAll();

    // Validate response data against schema
    const validatedLawyers = lawyerResponseSchema.parse(lawyers);
    return res.status(200).json(validatedLawyers);
  } catch (error) {
    next(error);
  }
};
