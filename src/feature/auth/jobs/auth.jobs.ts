import { logger } from "@/lib/logger";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { createAuthEvent } from "../operations/auth.create";
import { AuthJobs } from "../auth.config";
import { AuthJobMap } from "../auth.types";

export class AuthJobHandler {
  static async handleLogin(data: AuthJobMap[typeof AuthJobs.Login]) {
    const authEvent = unwrapJobResult(
      await createAuthEvent({
        userId: data.userId,
        eventType: "login",
        createdAt: new Date(),
      }),
      { message: "Could not create auth event", shouldRetry: true },
    );

    logger.info(
      { userId: data.userId, authEventId: authEvent.data?.id },
      "Processing login alert",
    );

    return { success: true };
  }

  static async handleRegistration(
    data: AuthJobMap[typeof AuthJobs.Registration],
  ) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }
}
