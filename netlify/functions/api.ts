import express from 'express';
import serverless from 'serverless-http';
import routes from '../../src/routes';

// Initialize express app
const api = express();

// Middleware
api.use(express.json());

// Mount routes
api.use('/.netlify/functions/api', routes);

// Error handling middleware
api.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Handle 404
api.use((req: express.Request, res: express.Response) => {
  return res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found` 
  });
});

export const handler = serverless(api);

// For local development
if (process.env.NETLIFY_DEV) {
  const PORT = process.env.PORT || 3000;
  api.listen(PORT, () => {
    console.log(`Netlify dev server listening on http://localhost:${PORT}`);
  });
}