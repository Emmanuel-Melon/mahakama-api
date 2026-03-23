export const InferenceJobs = {
  TextGeneration: "text-generation",
  DocumentAnalysis: "document-analysis",
  EmbeddingGeneration: "embedding-generation",
} as const;

export const LLMProviders = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  GEMINI: "gemini",
  OLLAMA: "ollama",
} as const;

export const InferenceModes = {
  FAST: "fast",
  CHEAP: "cheap",
  BALANCED: "balanced",
  SMART: "smart",
} as const;

export const LLMProviderValues = Object.values(LLMProviders) as [
  string,
  ...string[],
];
export const InferenceModeValues = Object.values(InferenceModes) as [
  string,
  ...string[],
];
