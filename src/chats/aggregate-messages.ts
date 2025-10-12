import { ChatMessage } from "./chat.types";

export function aggregateMessages(messages: ChatMessage[]) {
  return messages.map((msg: ChatMessage) => {
    const role: "user" | "assistant" =
      msg.sender.type === "user" || msg.sender.type === "anonymous"
        ? "user"
        : "assistant";
    return {
      role,
      content: msg.content,
    };
  });
}
