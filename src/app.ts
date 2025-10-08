import express = require('express');
import { Request, Response } from 'express';
import { config } from './config';

const app = express();
const port = config.port;

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Mahakama API Server' });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export for testing and module loading
export { app, server };

// For CommonJS default import support
export default app;
