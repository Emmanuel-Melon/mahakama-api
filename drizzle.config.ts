import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

import './src/users/user.schema';
import './src/lawyers/lawyer.schema';
import './src/questions/question.schema';
import './src/documents/document.schema';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/users/user.schema.ts',
    './src/lawyers/lawyer.schema.ts',
    './src/questions/question.schema.ts',
    './src/documents/document.schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: config.netlifyDatabaseUrlUnpooled!,
  },
});
