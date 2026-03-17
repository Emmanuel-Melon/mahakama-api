import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { dbConfig } from './src/config';

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./src/feature/**/*.schema.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: dbConfig.postgres.url,
  },
});