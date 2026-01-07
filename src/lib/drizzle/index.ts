import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dbConfig } from "@/config";
import { combinedUsersSchema } from "@/feature/users/users.schema";
import * as chatsSchema from "@/feature/chats/chats.schema";
import { combinedDocumentsSchema } from "@/feature/documents/documents.schema";
import { combinedMessagesSchema } from "@/feature/messages/messages.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";

const pool = new Pool({
  connectionString: dbConfig.postgres.url,
});

export const db = drizzle(pool, {
  schema: {
    ...combinedUsersSchema,
    ...chatsSchema,
    ...combinedDocumentsSchema,
    ...combinedMessagesSchema,
    ...lawyersTable,
  },
  logger: process.env.NODE_ENV !== "production",
});

export type Database = typeof db;

export const closeDb = async () => {
  await pool.end();
};
