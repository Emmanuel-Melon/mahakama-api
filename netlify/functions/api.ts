import express from 'express';
import serverless from 'serverless-http';
import { app } from '../../src/app';

// Create a new router for the Netlify function
const server = express();

// Set NETLIFY_DEV environment variable for local development
if (process.env.NETLIFY_DEV) {
  process.env.NODE_ENV = 'development';
}

// Mount the app under the correct path for Netlify Functions
server.use('/.netlify/functions/api', app);

// For local development with Netlify Dev
if (process.env.NETLIFY_DEV) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Netlify dev server listening on http://localhost:${PORT}/.netlify/functions/api`);
  });
}

// Create the serverless handler
export const handler = serverless(server, {
  // Ensure the base path is stripped from the request path
  request: (req: any) => {
    req.url = req.url.replace('/.netlify/functions/api', '') || '/';
    return req;
  }
});

export default handler;