ALTER TABLE "chat_sessions" ALTER COLUMN "sender_type" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "chat_messages" ALTER COLUMN "sender_type" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "sender_display_name";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "question_id";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "metadata";