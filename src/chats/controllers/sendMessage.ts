import { Request, Response, NextFunction } from 'express';
import { sendMessage } from '../operations/sendMessage';
import { AddMessageInput } from '../chat.types';

export const sendMessageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { content, sender, questionId, metadata } = req.body as AddMessageInput;
    
    const message = await sendMessage({
      chatId,
      content,
      sender,
      questionId,
      metadata,
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};
