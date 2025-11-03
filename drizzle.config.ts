import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

import './src/users/users.schema';
import './src/lawyers/lawyers.schema';
import './src/documents/documents.schema';
import './src/chats/chats.schema';
import './src/auth/auth.schema';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/users/users.schema.ts',
    './src/lawyers/lawyers.schema.ts',
    './src/documents/documents.schema.ts',
    './src/chats/chats.schema.ts',
    './src/auth/auth.schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
});
