import { Request, Response } from 'express';
import { listQuestions } from '../operations/list';

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    const result = await listQuestions({
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
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch questions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
