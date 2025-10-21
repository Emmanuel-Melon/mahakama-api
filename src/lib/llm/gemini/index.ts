import { Message, LLMResponse } from "../types";
import { ILLMClient } from "../client";
import { GoogleGenAI } from "@google/genai";
import { config } from "../../../config";

export * from "./gemini.chat";
export * from "./gemini.embeddings";

export class GeminiClient implements ILLMClient {
  protected readonly client: GoogleGenAI;
  protected readonly GENERATIVE_MODEL_NAME = "gemini-2.0-flash";
  protected readonly EMBEDDING_MODEL_NAME = "models/embedding-001";

  constructor() {
    const apiKey = config.geminiApiKey;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY environment variable is not set. Please add it to your .env file.",
      );
    }

    this.client = new GoogleGenAI({ apiKey });
  }

  public async createChatCompletion(messages: Message[]): Promise<LLMResponse> {
    try {
      const { systemMessage, userMessage } = this.extractMessages(messages);
      const fullPrompt = systemMessage
        ? `${systemMessage}\n\n${userMessage}`
        : userMessage;

      const response = await this.client.models.generateContent({
        model: this.GENERATIVE_MODEL_NAME,
        contents: fullPrompt,
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

  protected extractMessages(messages: Message[]): {
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
