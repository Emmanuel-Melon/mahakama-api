import { Request, Response } from "express";
import { findAll } from "./operations/list";
import { findById, findByEmail } from "./operations/find";
import { lawyerResponseSchema } from "./lawyer.schema";

export const lawyerController = {
  async getLawyers(req: Request, res: Response) {
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
  },

  async getLawyerById(req: Request, res: Response) {
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
  },

  async getLawyerByEmail(req: Request, res: Response) {
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
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
};
