import { Router } from 'express';
import { processQuestion, getQuestion, getQuestions } from './controllers/question.controller';

const router = Router();

// Process a new question
router.post('/', processQuestion);

// Get a specific question by ID
router.get('/:id', getQuestion);

// List all questions with pagination
router.get('/', getQuestions);

export const questionRoutes = router;
