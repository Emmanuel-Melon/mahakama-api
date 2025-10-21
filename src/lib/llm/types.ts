export type LLMProvider = "gemini" | "ollama";

export type MessageRole = "system" | "user" | "assistant" | "function";

export interface Message {
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
}

export interface ILLMClient {
  createChatCompletion(
    messages: Message[],
    systemPrompt?: string,
  ): Promise<LLMResponse>;
}
