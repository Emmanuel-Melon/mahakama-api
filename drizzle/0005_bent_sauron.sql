ALTER TABLE "questions" ADD COLUMN "chat_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "is_root" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "user_fingerprint" text;