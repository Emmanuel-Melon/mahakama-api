import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../../config";
import { usersTable } from "../../users/user.schema";

export const db = drizzle(config.databaseUrl);
