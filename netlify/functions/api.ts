import express, { Request, Response, Router } from "express";
import serverless from "serverless-http";

// Initialize express app
const api = express();

// Middleware
api.use(express.json());

// Create router
const router = Router();

// Test endpoint
router.get("/hello", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Hello from Mahakama API!" });
});

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString() 
  });
});

// Mount router
api.use("/.netlify/functions/api", router);

// Error handling middleware
api.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  return res.status(500).json({ 
    error: "Something went wrong!",
    message: err.message 
  });
});

// Handle 404
api.use((req: Request, res: Response) => {
  return res.status(404).json({ 
    error: "Not Found",
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