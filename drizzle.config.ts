import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/users/user.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.netlifyDatabaseUrlUnpooled!,
  },
});
