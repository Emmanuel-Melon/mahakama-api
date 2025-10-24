import { Request, Response, NextFunction } from "express";
import { findById } from "../operations/lawyers.find";
import { lawyerResponseSchema } from "../lawyer.schema";
import { ApiError, NotFoundError } from "../../middleware/errors";

export const getLawyerByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lawyerId = parseInt(req.params.id);

    if (isNaN(lawyerId)) {
      throw new ApiError("Invalid lawyer ID", 400, "INVALID_LAWYER_ID");
    }

    const lawyer = await findById(lawyerId);

    if (!lawyer) {
      throw new NotFoundError("Lawyer", { id: lawyerId });
    }

    // Validate response data against schema
    const validatedLawyer = lawyerResponseSchema.parse(lawyer);
    return res.status(200).json({
      success: true,
      data: validatedLawyer,
    });
  } catch (error) {
    next(error);
  }
};
