import express from 'express';
import serverless from 'serverless-http';
import { app } from '../../src/app';

// Create a new router for the Netlify function
const server = express();

// Mount the app under the correct path for Netlify Functions
server.use('/.netlify/functions/api', app);

// For local development with Netlify Dev
if (process.env.NETLIFY_DEV) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Netlify dev server listening on http://localhost:${PORT}`);
  });
}

// Create the serverless handler
export const handler = serverless(server);

export default handler;