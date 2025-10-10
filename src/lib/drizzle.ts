import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "../config";

if (!config.netlifyDatabaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(config.netlifyDatabaseUrl);
export const db = drizzle(sql);

export * from "../users/user.schema";
