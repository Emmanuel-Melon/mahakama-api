import { Request, Response } from 'express';
import { createDocument } from '../operations/create';
import { CreateDocumentInput } from '../document.types';

export const createDocumentHandler = async (req: Request, res: Response) => {
  try {
    const documentData: CreateDocumentInput = req.body;
    const newDocument = await createDocument({
      ...documentData,
      // Ensure the URL is properly formatted
      storageUrl: documentData.storageUrl.startsWith('https://')
        ? documentData.storageUrl
        : `https://${documentData.storageUrl}`,
    });
    
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ 
      error: 'Failed to create document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
