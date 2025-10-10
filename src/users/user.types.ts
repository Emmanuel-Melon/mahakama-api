export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewUser {
  name: string;
  email: string;
  role?: 'user' | 'admin'; // Optional with default value in the schema
}