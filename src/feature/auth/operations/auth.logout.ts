import { logger } from "@/lib/logger";
import { AuthEvents } from "../auth.config";

type LogoutParams = {
  userId: string;
  token: string;
  userAgent?: string;
  ip?: string;
};

export const logoutUser = async ({
  userId,
  token,
  userAgent,
  ip,
}: LogoutParams) => {
  try {
    logger.info({
      event: AuthEvents.Logout,
      userId,
      userAgent,
      ip,
      message: "User logged out successfully",
    });

    return { success: true };
  } catch (error) {
    logger.error({
      event: AuthEvents.Logout,
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to logout user",
    });
    throw error;
  }
};
