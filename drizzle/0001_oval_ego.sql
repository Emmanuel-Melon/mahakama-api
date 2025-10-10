CREATE TABLE "lawyers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"specialization" varchar(100) NOT NULL,
	"experience_years" integer NOT NULL,
	"rating" integer NOT NULL,
	"cases_handled" integer DEFAULT 0 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"location" varchar(100) NOT NULL,
	"languages" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lawyers_email_unique" UNIQUE("email")
);
