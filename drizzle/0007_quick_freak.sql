ALTER TABLE "chat_sessions" ADD COLUMN "sender_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_sessions" DROP COLUMN "user_type";