import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { dbConfig } from './src/config';
import { resolveAbsolutePaths } from './src/utils/fs';

import './src/feature/users/users.schema';
import './src/feature/lawyers/lawyers.schema';
import './src/feature/documents/documents.schema';
import './src/feature/chats/chats.schema';
import './src/feature/auth/auth.schema';
import './src/feature/services/services.schema';

const schemaPaths = resolveAbsolutePaths([
  './src/feature/users/users.schema.ts',
  './src/feature/lawyers/lawyers.schema.ts',
  './src/feature/documents/documents.schema.ts',
  './src/feature/chats/chats.schema.ts',
  './src/feature/auth/auth.schema.ts',
  './src/feature/services/services.schema.ts',
  './src/feature/messages/messages.schema.ts'
]);

export default defineConfig({
  out: './drizzle',
  schema: schemaPaths,
  dialect: 'postgresql',
  dbCredentials: {
    url: dbConfig.postgres.url,
  },
});
