import express = require('express');
import { Request, Response, NextFunction } from 'express';
import { config } from './config';
import routes from './routes';

const app = express();
const port = config.port;

// Middleware
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint (available at both /health and /api/health)
app.get(['/health', '/api/health'], (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Mahakama API',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api', routes); // Mount routes under /api in both dev and production

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to Mahakama API Server',
    documentation: process.env.NETLIFY_DEV 
      ? 'http://localhost:3000/api-docs' 
      : 'https://your-netlify-site.netlify.app/api-docs'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api/users', '/api/lawyers', '/health']
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Something went wrong!'
  });
});

// Export the Express app for both serverless and server usage
export { app };

export default app;
