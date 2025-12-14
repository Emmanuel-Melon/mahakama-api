import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { ChatMessage } from "../chats/chats.schema";

export const MessageSerializer: JsonApiResourceConfig<ChatMessage> = {
  type: "message",
  attributes: (message: ChatMessage) => message,
};

export const MessageEvents = {
  MessageSent: {
    label: "sent",
    jobName: "message-sent",
  },
  MessageReceived: {
    label: "received",
    jobName: "message-received",
  },
  MessageFailed: {
    label: "failed",
    jobName: "message-failed",
  },
} as const;

export type MessagesJobType =
  (typeof MessageEvents)[keyof typeof MessageEvents]["jobName"];
