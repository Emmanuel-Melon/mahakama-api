import express from 'express';
import serverless from 'serverless-http';
import { app } from '../../src/app';

// Create a new router for the Netlify function
const server = express();

// Set NODE_ENV for local development
if (process.env.NETLIFY_DEV) {
  process.env.NODE_ENV = 'development';
}

// Mount the app at the root path
server.use('/', app);

// For local development with Netlify Dev
if (process.env.NETLIFY_DEV) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Netlify dev server listening on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/.netlify/functions/api`);
  });
}

// Create the serverless handler
export const handler = serverless(server);

export default handler;