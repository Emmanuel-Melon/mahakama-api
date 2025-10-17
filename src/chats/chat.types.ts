// Base user information
export type SenderType = "user" | "assistant" | "system";

export interface BaseUser {
  type: SenderType;
  id: string; // For anonymous users, this will be a generated ID
  displayName?: string;
}

export enum UserTypeEnum {
  ANONYMOUS = "anonymous",
  USER = "user",
  ASSISTANT = "assistant",
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    type: SenderType;
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
  type: UserTypeEnum = UserTypeEnum.ANONYMOUS,
): BaseUser => ({
  type: type as SenderType,
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
