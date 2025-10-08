import { Request, Response } from 'express';
import { findAll } from "./operations/list";
import { findById } from "./operations/find";

export const userController = {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch user',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
};
