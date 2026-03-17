import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { DocumentJobs } from "../document.config";
import { DocumentsJobHandler } from "./documents.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { DocumentJobTypes } from "../documents.types";

const documentsHandlers: JobHandlerMap<DocumentJobTypes> = {
  [DocumentJobs.DocumentUploaded.jobName]: (data) =>
    DocumentsJobHandler.handleDocumentUploaded(data),
};

export const initDocumentsWorker = () =>
  createBullWorker<DocumentJobTypes>(QueueName.Documents, documentsHandlers);
