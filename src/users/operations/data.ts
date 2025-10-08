import { User } from '../user.types';

// Mock database
export const users: User[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];