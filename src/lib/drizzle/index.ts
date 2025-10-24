import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../../config";
import { usersTable } from "../../users/user.schema";

console.log(config.databaseUrl);

export const db = drizzle(config.databaseUrl);

const clearDatabase = async () => {
  await db.delete(usersTable);
};

// (async () => {
//   await clearDatabase();
// })();
