import { Request, Response } from "express";
import { findAll } from "../operations/list";
import { userResponseSchema } from "../user.schema";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await findAll();
    const validatedUsers = users.map(user => userResponseSchema.parse(user));
    return res.status(200).json(validatedUsers);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch users",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
