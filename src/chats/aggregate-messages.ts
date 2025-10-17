import { ChatMessage } from "./chat.types";
import { SenderType, UserTypeEnum } from "./chat.types";

export function aggregateMessages(messages: ChatMessage[]) {
  return messages.map((msg: ChatMessage) => {
    // Convert SenderType to a role
    const role =
      msg.sender.type === UserTypeEnum.USER
        ? ("user" as const)
        : ("assistant" as const);

    return {
      role,
      content: msg.content,
    };
  });
}
