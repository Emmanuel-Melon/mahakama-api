import { Request, Response, NextFunction } from "express";
import { findAll } from "./operations/list";
import { findById } from "./operations/find";
import { createUser as createUserOperation } from "./operations/create";
import { validateCreateUser } from "./user.middleware";

export const userController = {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch users",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch user",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, role } = req.validatedData;

      const newUser = await createUserOperation({
        name,
        email,
        role,
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);

      if (error instanceof Error && error.message.includes("duplicate")) {
        return res.status(409).json({
          error: "Email already exists",
          message: "A user with this email already exists",
        });
      }

      return res.status(500).json({
        error: "Failed to create user",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
};
