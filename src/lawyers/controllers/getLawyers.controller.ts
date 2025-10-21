import { Request, Response, NextFunction } from "express";
import { findAll, type FindAllOptions } from "../operations/list";
import { lawyersListResponseSchema } from "../lawyer.schema";

export const getLawyers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Parse query parameters
    const {
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      specialization,
      minExperience,
      maxExperience,
      minRating,
      location,
      language,
    } = req.query;

    // Convert string parameters to appropriate types
    const options: FindAllOptions = {
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 10,
      sortBy: sortBy as FindAllOptions["sortBy"],
      sortOrder: sortOrder as "asc" | "desc",
      search: search as string,
      specialization: specialization as string,
      minExperience: minExperience
        ? parseInt(minExperience as string, 10)
        : undefined,
      maxExperience: maxExperience
        ? parseInt(maxExperience as string, 10)
        : undefined,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
      location: location as string,
      language: language as string,
    };

    const result = await findAll(options);

    // Validate response data against schema
    const validatedLawyers = lawyersListResponseSchema.parse(result.data);

    return res.status(200).json({
      success: true,
      data: validatedLawyers,
      metadata: result.meta,
    });
  } catch (error) {
    next(error);
  }
};
