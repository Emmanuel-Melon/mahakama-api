import { Router } from 'express';
import { getDocuments, getDocumentById } from './document.controller';

const router = Router();

// Get all documents
router.get('/', getDocuments);

// Get a specific document by ID
router.get('/:id', getDocumentById);

export const documentRoutes = router;
