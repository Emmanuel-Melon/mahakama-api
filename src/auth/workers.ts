import { Worker } from "bullmq";
import { QueueName } from "../lib/bullmq";
import { config } from "../config";
import { stripUpstashUrl } from "../lib/bullmq/utils";
import { AuthJobType } from "./queue";
import { v4 as uuid } from "uuid";
import { createUser } from "../users/operations/users.create";
import { findById, findByFingerprint } from "../users/operations/users.find";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../auth/utils";

const { host, port } = stripUpstashUrl(config.upstashRedisRestUrl as string);
const upStashPassword = config.upstashRedisRestToken;

export async function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: await hashPassword("test-password"),
  };
}

const authWorker = new Worker(
  QueueName.Auth,
  async (job) => {
    console.log(
      `Processing job ${job.id} of type ${job.name === AuthJobType.BrowserFingerprint}!!!`,
    );
    if (job.name === AuthJobType.BrowserFingerprint) {
      const userByFingerprint = await findByFingerprint(job.id!);
      if (userByFingerprint) {
        return;
      }
      const randomUser = await createRandomUser();
      const newUser = await createUser({
        id: uuid(),
        name: randomUser.name,
        email: randomUser.email,
        fingerprint: job.id!,
        userAgent: job.data.userAgent,
        password: randomUser.password,
      });
    }
  },
  {
    connection: {
      host,
      port,
      password: upStashPassword,
      tls: {},
    },
    concurrency: 5, // Process 5 jobs in parallel
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
    removeOnFail: { count: 200 }, // Keep last 200 failed jobs
  },
);

authWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

authWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed with error:`, error);
});

authWorker.on("error", (error) => {
  console.error("Worker error:", error);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down worker...");
  await authWorker.close();
  process.exit(0);
});

console.log("Auth Worker started and listening for jobs...");
