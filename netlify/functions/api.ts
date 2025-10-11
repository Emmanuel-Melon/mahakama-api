import express from 'express';
import serverless from 'serverless-http';
import { app } from '../../src/app';

// Create a new router for the Netlify function
const server = express();

// Set NODE_ENV for local development
if (process.env.NETLIFY_DEV) {
  process.env.NODE_ENV = 'development';
}

// Mount the app at the root path for Netlify Functions
// The '/api' prefix is already handled in the routes
server.use('/', app);

// For local development with Netlify Dev
if (process.env.NETLIFY_DEV) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Netlify dev server listening on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/.netlify/functions/api`);
  });
}

// Create the serverless handler with base path handling
export const handler = serverless(server, {
  request: (req: any) => {
    // Remove the function path from the URL
    req.url = req.url.replace('/.netlify/functions/api', '') || '/';
    return req;
  }
});

export default handler;