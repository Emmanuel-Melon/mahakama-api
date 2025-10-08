import { Router } from 'express';
import { userController } from './user.controller';

const router = Router();

// User routes
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);


export const userRoutes = router;
