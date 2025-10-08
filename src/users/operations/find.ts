import { User } from '../user.types';
import { users } from './data';

export async function findById(id: number): Promise<User | undefined> {
    return users.find(user => user.id === id);
  }