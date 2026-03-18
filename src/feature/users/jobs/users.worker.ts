import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { UserJobs } from "../users.config";
import { UsersJobHandler } from "./users.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { UserJobTypes } from "../users.types";

const usersHandlers: JobHandlerMap<UserJobTypes> = {
  [UserJobs.UserCreated.jobName]: (data) =>
    UsersJobHandler.handleUserCreated(data),
  [UserJobs.UserUpdated.jobName]: (data) =>
    UsersJobHandler.handleUserUpdated(data),
  [UserJobs.UserDeleted.jobName]: (data) =>
    UsersJobHandler.handleUserDeleted(data),
  [UserJobs.UserOnboarded.jobName]: (data) =>
    UsersJobHandler.handleUserOnboarded(data),
  [UserJobs.UserVerified.jobName]: (data) =>
    UsersJobHandler.handleUserVerified(data),
};

export const initUsersWorker = () =>
  createBullWorker<UserJobTypes>(QueueName.User, usersHandlers);
