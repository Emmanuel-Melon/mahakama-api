import { logger } from "@/lib/logger";

export class ChatsJobHandler {
    static async handleMessageSent(data: { userId: string; deviceId: string; message: string }) {

        logger.info(
            { userId: data.userId },
            "Processing message sent job",
        );

        return { success: true };
    }
}