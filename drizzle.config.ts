import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config/dev.config';

import './src/feature/users/users.schema';
import './src/feature/lawyers/lawyers.schema';
import './src/feature/documents/documents.schema';
import './src/feature/chats/chats.schema';
import './src/feature/auth/auth.schema';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/feature/users/users.schema.ts',
    './src/feature/lawyers/lawyers.schema.ts',
    './src/feature/documents/documents.schema.ts',
    './src/feature/chats/chats.schema.ts',
    './src/feature/auth/auth.schema.ts',
    "./src/schema.ts"
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
});
