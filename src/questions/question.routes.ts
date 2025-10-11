import { Router } from 'express';
import { processQuestion } from './controllers/processQuestion.controller';
import { getQuestion } from './controllers/getQuestion.controller';
import { getQuestions } from './controllers/getQuestions.controller';

const questionRoutes = Router();

questionRoutes.post('/', processQuestion);
questionRoutes.get('/:id', getQuestion);
questionRoutes.get('/', getQuestions);

export default questionRoutes;
