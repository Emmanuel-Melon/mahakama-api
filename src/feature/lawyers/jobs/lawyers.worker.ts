import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { LawyerJobs } from "../lawyers.config";
import { LawyersJobHandler } from "./lawyers.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { LawyersJobTypes } from "../lawyers.types";

const lawyersHandlers: JobHandlerMap<LawyersJobTypes> = {
  [LawyerJobs.LawyerOnboarded.jobName]: (data) =>
    LawyersJobHandler.handleLawyerOnboarded(data),
  [LawyerJobs.LawyerVerified.jobName]: (data) =>
    LawyersJobHandler.handleLawyerVerified(data),
};

export const initLawyersWorker = () =>
  createBullWorker<LawyersJobTypes>(QueueName.User, lawyersHandlers);
