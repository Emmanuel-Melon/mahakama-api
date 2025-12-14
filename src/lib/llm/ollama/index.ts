import { Ollama } from "ollama";
import {
  LLMMessage,
  LLMResponse,
  ILLMProvider,
  ChatCompletionOptions,
} from "../llms.types";
import { llmConfig } from "@/config";
import { getMessagesForLLM } from "@/feature/chats/operations/messages.list";
import { logger } from "@/lib/logger";
import { formatMessagesForProvider } from "../llm.utils";

export class OllamaClient implements ILLMProvider {
  private static instance: OllamaClient;
  private client: Ollama;
  private defaultModel = "gemma3:1b";
  private defaultOptions: Partial<ChatCompletionOptions> = {
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    responseFormat: "json",
  };
  private constructor() {
    const ollamaConfig = {
      host: llmConfig.ollama.url,
    };
    this.client = new Ollama(ollamaConfig);
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
    chatId: string,
    systemPrompt?: string,
    options: ChatCompletionOptions = {},
  ): Promise<LLMResponse> {
    const modelToUse = options.model || this.defaultModel;
    const mergedOptions = { ...this.defaultOptions, ...options };

    let enhancedSystemPrompt = systemPrompt || "";
    let responseFormat = mergedOptions.responseFormat;

    const messages = await getMessagesForLLM(chatId);
    logger.info({ messages }, "chat I got fr");

    const formattedRequest = formatMessagesForProvider(
      "ollama",
      messages,
      mergedOptions,
    );
    const chatMessages = enhancedSystemPrompt
      ? [
          { role: "system" as const, content: enhancedSystemPrompt },
          ...messages,
        ]
      : messages;

    console.log("requestOptions", mergedOptions);

    const requestOptions: any = {
      model: modelToUse,
      messages: formattedRequest.messages,
      options: mergedOptions,
    };

    const response = await this.client.chat(requestOptions);

    return {
      content: response?.message?.content,
      provider: "ollama",
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }
}

export const generateEmbedding = async (query: string) => {
  const response = await ollamaClient.getClient().embed({
    model: "nomic-embed-text",
    input: query,
  });

  return {
    model: "nomic-embed-text",
    embeddings: response.embeddings,
    query,
    metadata: {},
  };
};

export const ollamaClient = OllamaClient.getInstance();
