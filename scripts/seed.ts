import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { config } from '../src/config';
import { usersTable, type NewUser } from '../src/users/user.schema';

if (!config.netlifyDatabaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const db = drizzle(config.netlifyDatabaseUrl);

const mockUsers: NewUser[] = [
  { 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'user'
  },
  { 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'admin'
  }
];

async function seedUsers() {
  try {
    console.log('Seeding users...');
    
    // Clear existing data
    await db.delete(usersTable);
    console.log('Cleared existing users');

    // Insert mock users
    const insertedUsers = await db
      .insert(usersTable)
      .values(mockUsers)
      .returning();
    
    console.log(`Successfully seeded ${insertedUsers.length} users`);
    console.log('Seeded users:', insertedUsers);
    
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

async function main() {
  await seedUsers();
  process.exit(0);
}

main();
