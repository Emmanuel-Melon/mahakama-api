import { z } from "zod";
import type { LLMProviderName, LLMResponse } from "@/lib/llm/llms.types";

// ─── Strategy ─────────────────────────────────────────────────────────────────

export interface IInferenceStrategy<TInput = unknown, TOutput = string> {
  readonly key: string;
  readonly preferredProvider: LLMProviderName;
  readonly fallbackProvider?: LLMProviderName;
  readonly systemPrompt?: string;
  readonly defaultModel?: string;
  readonly outputSchema?: z.ZodType<TOutput>;

  buildPrompt(input: TInput): string;
  parseResponse?(raw: LLMResponse<TOutput>): TOutput;
}

// ─── Run options ──────────────────────────────────────────────────────────────

export interface InferenceRunOptions {
  provider?: LLMProviderName; // call-time override — highest priority
  model?: string; // call-time model override
  userId?: string; // used to load persisted user preferences
}

// ─── Resolved config (internal) ───────────────────────────────────────────────

export interface ResolvedInferenceConfig {
  provider: LLMProviderName;
  model?: string;
}

// ─── User preferences ─────────────────────────────────────────────────────────

export interface UserInferencePreference {
  userId: string;
  strategyKey: string;
  provider: LLMProviderName;
  model?: string | null;
}

// Preference schemas for documentation
export const inferencePreferenceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  strategyKey: z.string(),
  provider: z.enum(["gemini", "ollama", "claude"]),
  model: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const providerSchema = z.object({
  name: z.enum(["gemini", "ollama", "claude"]),
  defaultModel: z.string(),
});

export const strategySchema = z.object({
  key: z.string(),
});

export interface ChatInput {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}
