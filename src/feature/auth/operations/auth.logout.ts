import { logger } from "../../lib/logger";
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
    // Here you would typically:
    // 1. Add the token to a blacklist (if using token invalidation)
    // 2. Or delete the refresh token from the database (if using refresh tokens)
    // 3. Or perform any other cleanup needed for logout

    logger.info({
      event: AuthEvents.LOGOUT_SUCCESS,
      userId,
      userAgent,
      ip,
      message: 'User logged out successfully'
    });

    return { success: true };
  } catch (error) {
    logger.error({
      event: AuthEvents.LOGOUT_FAILED,
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to logout user'
    });
    throw error;
  }
};