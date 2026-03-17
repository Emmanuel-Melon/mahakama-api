import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { ChatsJobs } from "../chats.config";
import { ChatsJobHandler } from "./chats.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { ChatsJobTypes } from "../chats.types";

const chatsHandlers: JobHandlerMap<ChatsJobTypes> = {
  [ChatsJobs.MessageSent.jobName]: (data) =>
    ChatsJobHandler.handleMessageSent(data),
};

export const initChatsWorker = () =>
  createBullWorker<ChatsJobTypes>(QueueName.Chat, chatsHandlers);
