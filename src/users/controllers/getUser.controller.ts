import { Request, Response } from "express";
import { findById } from "../operations/find";
import { userResponseSchema } from "../user.schema";

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validatedUser = userResponseSchema.parse(user);
    return res.status(200).json(validatedUser);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch user",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
