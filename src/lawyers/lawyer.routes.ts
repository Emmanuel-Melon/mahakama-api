import { Router } from 'express';
import { lawyerController } from './lawyer.controller';

const router = Router();

// Lawyer routes
router.get('/', lawyerController.getLawyers);
router.get('/:id', lawyerController.getLawyerById);
router.get('/email', lawyerController.getLawyerByEmail);

export const lawyerRoutes = router;
