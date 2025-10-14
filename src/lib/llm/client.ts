import { Message, LLMResponse, LLMProvider } from "./types";
import { GeminiClient } from "./gemini";

export enum LLMProviders {
  GEMINI = "gemini",
}

export interface ILLMClient {
  createChatCompletion(
    messages: Message[],
    systemPrompt?: string,
  ): Promise<LLMResponse>;
}

const clients: Record<LLMProvider, ILLMClient> = {
  gemini: new GeminiClient(),
};

export function getLLMClient(
  provider: LLMProvider = LLMProviders.GEMINI,
): ILLMClient {
  const client = clients[provider];
  if (!client) {
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }
  return client;
}
