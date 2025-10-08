import { Request, Response } from 'express';

// Mock data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
];

// Get all users
export const getUsers = (req: Request, res: Response) => {
  try {
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get single user by ID
export const getUserById = (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};
