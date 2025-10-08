import { User } from '../user.types';
import { users } from './data';

export async function findAll(): Promise<User[]> {
    return users;
}