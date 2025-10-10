import { Router } from 'express';
import { userController } from './user.controller';
import { validateCreateUser } from './user.middleware';

const router = Router();

router.get('/', (req, res, next) => {
  console.log('GET /users route handler called');
  userController.getUsers(req, res).catch(next);
});

router.get('/:id', (req, res, next) => {
  console.log(`GET /users/${req.params.id} route handler called`);
  userController.getUserById(req, res).catch(next);
});

router.post('/', validateCreateUser, (req, res, next) => {
  console.log('POST /users route handler called');
  userController.createUser(req, res, next).catch(next);
});

export const userRoutes = router;
