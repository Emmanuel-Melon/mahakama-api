import { Lawyer } from '../lawyer.types';
import { lawyers } from './data';

export async function findAll(): Promise<Lawyer[]> {
  return lawyers;
}