import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dbConfig } from "@/config";
import { combinedUsersSchema } from "@/feature/users/users.schema";
import * as chatsSchema from "@/feature/chats/chats.schema";

// Create the connection pool
const pool = new Pool({
  connectionString: dbConfig.postgres.url,
});

// Create the Drizzle instance with proper typing
export const db = drizzle(pool, {
  schema: {
    ...combinedUsersSchema,
    ...chatsSchema,
  },
  logger: process.env.NODE_ENV !== "production",
});

// Export types
export type Database = typeof db;

// Export a function to close the pool
export const closeDb = async () => {
  await pool.end();
};
