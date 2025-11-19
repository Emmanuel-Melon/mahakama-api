import { z } from "zod";
export enum LLMProviderType {
  GEMINI = "gemini",
  OLLAMA = "ollama",
}

export interface ILLMClient extends ILLMProvider {
  setProvider(provider: LLMProvider): void;
  getCurrentProvider(): LLMProvider;
}

export type LLMProvider = "gemini" | "ollama";

export type MessageRole = "system" | "user" | "assistant" | "function";

export interface LLMMessage {
  role: MessageRole;
  content: string;
  name?: string;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  validation?: {
    isValid: boolean;
    errors?: z.ZodError[];
    parsedData?: any;
  };
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  responseFormat?: "text" | "json";
  // Schema validation
  responseSchema?: z.ZodSchema<any>;
  strictSchemaValidation?: boolean; // Whether to retry on schema failures
  [key: string]: any;
}

export interface ILLMProvider {
  createChatCompletion(
    chatId: string,
    systemPrompt?: string,
    options?: ChatCompletionOptions,
  ): Promise<LLMResponse>;
}

