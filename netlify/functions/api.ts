import express from 'express';
import serverless from 'serverless-http';
import app from '../../src/app';

// Create the serverless handler
export const handler = serverless(app, {
  // Ensure the base path is handled correctly
  basePath: '/.netlify/functions/api'
});

// For local development with Netlify Dev
if (process.env.NETLIFY_DEV) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Netlify dev server listening on http://localhost:${PORT}`);
  });
}

export default handler;