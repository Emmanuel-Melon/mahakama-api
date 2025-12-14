import {
  LLMMessage,
  LLMResponse,
  ILLMProvider,
  ChatCompletionOptions,
} from "../llms.types";
import { GoogleGenAI } from "@google/genai";
import { llmConfig } from "@/config";
import { getMessagesForLLM } from "@/feature/chats/operations/messages.list";

export class GeminiClient implements ILLMProvider {
  protected readonly client: GoogleGenAI;
  protected readonly GENERATIVE_MODEL_NAME = "gemini-2.0-flash";
  protected readonly EMBEDDING_MODEL_NAME = "models/embedding-001";
  private defaultOptions: Partial<ChatCompletionOptions> = {
    temperature: 0.9,
    maxTokens: 2048,
    topP: 0.8,
    topK: 40,
  };

  constructor() {
    this.client = new GoogleGenAI({ apiKey: llmConfig.gemini.apiKey });
  }

  public async createChatCompletion(
    chatId: string,
    systemPrompt?: string,
    options?: ChatCompletionOptions,
  ): Promise<LLMResponse> {
    try {
      const messages = await getMessagesForLLM(chatId);
      const fullPrompt = systemPrompt
        ? `${systemPrompt}\n\n${messages}`
        : messages;

      const response = await this.client.models.generateContent({
        model: this.GENERATIVE_MODEL_NAME,
        contents: fullPrompt,
        ...this.defaultOptions,
        ...options,
      });

      if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response from Gemini");
      }

      return {
        content: response.candidates[0].content.parts[0].text,
        provider: "gemini",
      };
    } catch (error) {
      console.error("Error in GeminiClient.createChatCompletion:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  protected extractMessages(messages: LLMMessage[]): {
    systemMessage?: string;
    userMessage: string;
  } {
    const systemMsg = messages.find((msg) => msg.role === "system");
    const userMsg = messages.find((msg) => msg.role === "user");

    if (!userMsg) {
      throw new Error("User message is required");
    }

    return {
      systemMessage: systemMsg?.content,
      userMessage: userMsg.content,
    };
  }
}

export class GeminiEmbeddingClient extends GeminiClient {
  public async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.models.embedContent({
        model: this.EMBEDDING_MODEL_NAME,
        contents: text,
        config: {
          taskType: "RETRIEVAL_DOCUMENT",
        },
      });

      const embedding = response.embeddings?.[0]?.values;

      if (!embedding || embedding.length === 0) {
        throw new Error("Embedding generation failed or returned empty vector");
      }

      return embedding;
    } catch (error) {
      console.error("Error in GeminiEmbeddingClient.generateEmbedding:", error);
      throw error;
    }
  }
}
