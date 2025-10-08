import { Router } from 'express';
import { userRoutes } from '../users/user.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Mahakama API',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
router.use('/users', userRoutes);

export default router;
