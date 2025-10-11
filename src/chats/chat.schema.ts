import { z } from 'zod';
import { RateLimitConfig } from './chat.types';

// Schema for creating a new chat
export const createChatSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    initialMessage: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

// Schema for sending a message
export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message content is required'),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

// Schema for chat ID in params
export const chatIdSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
  }),
});

// Rate limiting configuration
export const RATE_LIMIT: RateLimitConfig = {
  anonymous: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 10, // 10 requests per day for anonymous users
  },
  user: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 100, // 100 requests per day for registered users
  },
};
