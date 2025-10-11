import { Request, Response } from 'express';
import { GeminiClient } from '../../lib/llm/gemini';
import { Message } from '../../lib/llm/types';
import { systemPrompt } from '../prompts';
import { CreateQuestionInput } from '../question.types';
import { createQuestion } from '../operations/create';

const geminiClient = new GeminiClient();

export const processQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ];

    // Get response from Gemini
    const response = await geminiClient.createChatCompletion(messages);
    const content = response.content;
    
    // Parse the response to extract the answer, related documents, and relevant laws
    let answer = content;
    let relatedDocuments = [];
    let relevantLaws = [];
    
    // Try to extract the structured data from the response
    try {
      const documentsMatch = content.match(/<<<DOCUMENTS>>>\s*\[([\s\S]*?)\]\s*<<<LAWS>>>/);
      const lawsMatch = content.match(/<<<LAWS>>>\s*\[([\s\S]*?)\]\s*$/);
      
      if (documentsMatch) {
        answer = content.split('<<<DOCUMENTS>>>')[0].trim();
        relatedDocuments = JSON.parse(`[${documentsMatch[1].trim()}]`);
      }
      
      if (lawsMatch) {
        relevantLaws = JSON.parse(`[${lawsMatch[1].trim()}]`);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      // Fallback to default data if parsing fails
      relatedDocuments = [
        {
          id: 1,
          title: "Legal Resources Guide",
          description: "General legal resources and information",
          url: "/legal-database/1"
        }
      ];
      relevantLaws = [
        {
          title: 'General Legal Principles',
          description: 'Basic legal principles and procedures',
        }
      ];
    }
    
    // Create question data object
    const questionData: CreateQuestionInput = {
      question,
      answer,
      relatedDocuments,
      relevantLaws,
      country: "South Sudan",
      provider: 'gemini'
    };

    // Save the question and its response
    const createdQuestion = await createQuestion(questionData);
    
    // Return the structured response
    res.status(200).json(createdQuestion);
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ 
      error: 'Failed to process question',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
