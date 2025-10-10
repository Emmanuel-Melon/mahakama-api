import { Router } from 'express';
import { processQuestion } from './question.controller';

const router = Router();

router.post('/', processQuestion);

export const questionRoutes = router;
