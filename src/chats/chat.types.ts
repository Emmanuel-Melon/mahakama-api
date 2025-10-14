// Base user information

export interface BaseUser {
  type: "anonymous" | "user" | "assistant";
  id: string; // For anonymous users, this will be a generated ID
  displayName?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    type: "user" | "assistant" | "anonymous";
    displayName?: string;
  };
  timestamp: Date;
  questionId?: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  user: BaseUser;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  metadata?: Record<string, any>;
}

export interface CreateChatInput {
  user: BaseUser;
  title: string;
  initialMessage?: string;
  metadata?: Record<string, any>;
}

export interface AddMessageInput {
  chatId: string;
  content: string;
  sender: BaseUser;
  questionId?: string; // Optional question ID to associate with the message
  metadata?: Record<string, any>;
}

// Helper function to create a base user
export const createBaseUser = (
  id: string,
  type: "anonymous" | "user" | "assistant" = "anonymous",
): BaseUser => ({
  type,
  id,
});

// Rate limiting configuration
export interface RateLimitConfig {
  anonymous: {
    windowMs: number;
    maxRequests: number;
  };
  user: {
    windowMs: number;
    maxRequests: number;
  };
}
