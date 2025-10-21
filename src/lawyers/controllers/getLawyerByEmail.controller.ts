import { Request, Response, NextFunction } from "express";
import { findByEmail } from "../operations/find";
import { lawyerResponseSchema } from "../lawyer.schema";
import { ApiError, NotFoundError } from "../../middleware/errors";

export const getLawyerByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new ApiError(
        "Email query parameter is required",
        400,
        "MISSING_EMAIL_PARAM",
      );
    }

    const lawyer = await findByEmail(email as string);

    if (!lawyer) {
      throw new NotFoundError("Lawyer", { email });
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
