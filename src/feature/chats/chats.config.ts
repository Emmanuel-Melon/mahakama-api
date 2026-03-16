import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { ChatSession } from "./chats.types";

export const ChatSerializer: JsonApiResourceConfig<ChatSession> = {
  type: "chat",
  attributes: (chat: ChatSession) => chat,
};

export const ChatEvents = {
  ChatCreated: {
    label: "created",
    jobName: "chat-created",
  },
  ChatUpdated: {
    label: "updated",
    jobName: "chat-updated",
  },
  ChatDeleted: {
    label: "deleted",
    jobName: "chat-deleted",
  },
  MessageSent: {
    label: "message-sent",
    jobName: "message-sent",
  },
} as const;

export type ChatsJobType =
  (typeof ChatEvents)[keyof typeof ChatEvents]["jobName"];
