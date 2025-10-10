import { Request, Response } from 'express';
import { GeminiClient } from '../lib/llm/gemini';
import { Message } from '../lib/llm/types';

const geminiClient = new GeminiClient();

export const processQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Create system prompt for legal context
    const systemPrompt = `You are a helpful legal assistant for the Kenyan legal system. 
    Provide clear, accurate, and concise answers to legal questions. 
    If you're unsure about any information, state that clearly. 
    Focus on Kenyan law and legal procedures.`;

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ];

    // Get response from Gemini
    const response = await geminiClient.createChatCompletion(messages);
    
    // Return the response from Gemini
    res.status(200).json({ 
      answer: response.content,
      provider: 'gemini'
    });
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ 
      error: 'Failed to process question',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
