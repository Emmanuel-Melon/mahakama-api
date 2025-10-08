import { Lawyer } from '../lawyer.types';
import { lawyers } from './data';

export async function findById(id: number): Promise<Lawyer | undefined> {
  return lawyers.find(lawyer => lawyer.id === id);
}

export async function findByEmail(email: string): Promise<Lawyer | undefined> {
  return lawyers.find(lawyer => lawyer.email.toLowerCase() === email.toLowerCase());
}
