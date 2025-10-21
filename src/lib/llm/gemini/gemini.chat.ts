import { Message } from "../types";
import { GeminiClient } from ".";

export class GeminiChat {
  private readonly client: GeminiClient;
  private messages: Message[] = [];
  private readonly systemPrompt?: string;

  constructor(systemPrompt?: string) {
    this.client = new GeminiClient();
    this.systemPrompt = systemPrompt;

    if (systemPrompt) {
      this.messages.push({
        role: "system",
        content: systemPrompt,
      });
    }
  }

  public async sendMessage(content: string): Promise<string> {
    try {
      // Add user message to history
      this.messages.push({
        role: "user",
        content,
      });

      // Get response from Gemini
      const response = await this.client.createChatCompletion([
        ...this.messages,
      ]);

      // Add assistant's response to history
      if (response.content) {
        this.messages.push({
          role: "assistant",
          content: response.content,
        });
      }

      return response.content;
    } catch (error) {
      console.error("Error in GeminiChat.sendMessage:", error);
      throw error;
    }
  }

  public getHistory(): Message[] {
    return [...this.messages];
  }

  public reset(systemPrompt?: string): void {
    this.messages = [];
    if (systemPrompt) {
      this.messages.push({
        role: "system",
        content: systemPrompt,
      });
    } else if (this.systemPrompt) {
      this.messages.push({
        role: "system",
        content: this.systemPrompt,
      });
    }
  }
}
