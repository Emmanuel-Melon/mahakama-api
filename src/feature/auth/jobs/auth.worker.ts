import { QueueName } from "@/lib/bullmq/bullmq.config";
import { AuthJobs } from "../auth.config";
import { createBullWorker } from "@/lib/bullmq";
import { AuthJobHandler } from "./auth.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { AuthJobTypes } from "../auth.types";

const authHandlers: JobHandlerMap<AuthJobTypes> = {
  [AuthJobs.Login.jobName]: (data) => AuthJobHandler.handleLogin(data),
  [AuthJobs.Registration.jobName]: (data) =>
    AuthJobHandler.handleRegistration(data),
};

export const initAuthWorker = () =>
  createBullWorker<AuthJobTypes>(QueueName.Auth, authHandlers);
