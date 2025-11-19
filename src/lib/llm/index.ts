import {
  LLMMessage,
  LLMResponse,
  LLMProvider,
  LLMProviderType,
  ILLMClient,
  ILLMProvider,
} from "./llms.types";
import { GeminiClient } from "./gemini";
import { OllamaClient } from "./ollama";

class LLMClientManager {
  private static instance: LLMClientManager;
  private providers: Record<LLMProvider, ILLMProvider>;
  private currentProvider: LLMProvider;

  private constructor() {
    this.currentProvider = LLMProviderType.OLLAMA;
    this.providers = {
      gemini: new GeminiClient(),
      ollama: OllamaClient.getInstance(),
    };
  }

  public static getInstance(): LLMClientManager {
    if (!LLMClientManager.instance) {
      LLMClientManager.instance = new LLMClientManager();
    }
    return LLMClientManager.instance;
  }

  public getClient(provider?: LLMProvider): ILLMProvider {
    const targetProvider = provider || this.currentProvider;
    const client = this.providers[targetProvider];
    if (!client) {
      throw new Error(`Unsupported LLM provider: ${targetProvider}`);
    }
    return client;
  }

  public setProvider(provider: LLMProvider): void {
    if (!(provider in this.providers)) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }
    this.currentProvider = provider;
  }

  public getCurrentProvider(): LLMProvider {
    return this.currentProvider;
  }
}

const llmClientManager = LLMClientManager.getInstance();
const llMClient = llmClientManager.getClient();
export { llmClientManager, llMClient };
