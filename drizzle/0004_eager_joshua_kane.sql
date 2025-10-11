ALTER TABLE "questions" ALTER COLUMN "answer" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;