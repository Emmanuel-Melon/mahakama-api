export const SenderType = {
  USER: "user" as const,
  ASSISTANT: "assistant" as const,
  SYSTEM: "system" as const,
} as const;

export type SenderType = (typeof SenderType)[keyof typeof SenderType];
export const SenderTypeValues = Object.values(SenderType) as [
  string,
  ...string[],
];
