// Define sender type enum - shared between chats and messages
export const SenderType = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export type SenderType = (typeof SenderType)[keyof typeof SenderType];
