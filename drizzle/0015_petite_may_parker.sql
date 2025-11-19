ALTER TABLE "chat_sessions" DROP CONSTRAINT "chat_sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_sessions" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "user_id";