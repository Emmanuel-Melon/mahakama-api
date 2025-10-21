import { ollamaClient } from ".";
import { Message } from "../types";

export const chat = async (
  messages: Message[],
  model: string = "gemma3:1b",
) => {
  const response = await ollamaClient.getClient().chat({
    model,
    messages,
  });

  return response;
};
