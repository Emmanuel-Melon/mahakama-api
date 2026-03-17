import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { MessageJobs } from "../messages.config";
import { MessagesJobHandler } from "./messages.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { MessageJobTypes } from "../messages.types";

const messagesHandlers: JobHandlerMap<MessageJobTypes> = {
  [MessageJobs.MessageSent.jobName]: (data) =>
    MessagesJobHandler.handleMessageSent(data),
};

export const initMessagesWorker = () =>
  createBullWorker<MessageJobTypes>(QueueName.Documents, messagesHandlers);
