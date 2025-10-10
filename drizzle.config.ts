import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

import './src/users/user.schema';
import './src/lawyers/lawyer.schema';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/users/user.schema.ts',
    './src/lawyers/lawyer.schema.ts'
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: config.netlifyDatabaseUrlUnpooled!,
  },
});
