import { Request, Response } from 'express';
import { listDocuments } from '../operations/list';

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { type, limit, offset } = req.query;
    
    const result = await listDocuments({
      type: type as string | undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    
    res.status(200).json({
      data: result.data,
      meta: {
        total: result.total,
        limit: limit ? Number(limit) : 10,
        offset: offset ? Number(offset) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch legal documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
