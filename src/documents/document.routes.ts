import { Router } from 'express';
import { getDocumentById } from './controllers/getDocumentById.controller';
import { getDocuments } from './controllers/getDocuments.controller';
import { createDocumentHandler } from './controllers/createDocument.controller';

const documentRoutes = Router();

documentRoutes.get('/', getDocuments);
documentRoutes.get('/:id', getDocumentById);
documentRoutes.post('/', createDocumentHandler);

export default documentRoutes;
