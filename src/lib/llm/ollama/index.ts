import { Ollama } from "ollama";
import { Message, LLMResponse, ILLMClient } from "../types";

export class OllamaClient implements ILLMClient {
  private static instance: OllamaClient;
  private client: Ollama;
  private defaultModel = "llama2"; // Default model, can be made configurable

  private constructor() {
    this.client = new Ollama();
  }

  public static getInstance(): OllamaClient {
    if (!OllamaClient.instance) {
      OllamaClient.instance = new OllamaClient();
    }
    return OllamaClient.instance;
  }

  public getClient(): Ollama {
    return this.client;
  }

  public async createChatCompletion(
    messages: Message[],
    systemPrompt?: string,
  ): Promise<LLMResponse> {
    try {
      // Format messages for Ollama API
      const chatMessages = systemPrompt
        ? [{ role: "system" as const, content: systemPrompt }, ...messages]
        : messages;

      const response = await this.client.chat({
        model: this.defaultModel,
        messages: chatMessages,
      });

      return {
        content: response.message.content,
        provider: "ollama",
        usage: {
          promptTokens: 0, // Ollama doesn't provide token counts by default
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error) {
      console.error("Error in Ollama chat completion:", error);
      throw error;
    }
  }
}

export const ollamaClient = OllamaClient.getInstance();
